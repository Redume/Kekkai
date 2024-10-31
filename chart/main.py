import os
import psycopg2
import uvicorn

import yaml
import matplotlib.pyplot as plt
import datetime

import dateutil.relativedelta
import random
import string

from fastapi import FastAPI, Response, status, Request
from psycopg2.extras import DictCursor

from starlette.staticfiles import StaticFiles
from middleware.plausible_analytics import PlausibleAnalytics


app = FastAPI()

config = yaml.safe_load(open('../config.yaml'))

con = psycopg2.connect(host=config['database']['host'],
                       user=config['database']['user'],
                       password=config['database']['password'],
                       database=config['database']['name'],
                       port=config['database']['port'])

cur = con.cursor(cursor_factory=DictCursor)
con.autocommit = True

if not os.path.exists('../charts'):
    os.mkdir('../charts')

app.mount('/static/charts', StaticFiles(directory='../charts/'))
app.middleware('http')(PlausibleAnalytics())

@app.get("/api/getChart/", status_code=status.HTTP_201_CREATED)
async def get_chart(
                    response: Response,
                    request: Request,
                    ):
    from_currency, conv_currency, start_date, end_date = None, None, None, None

    if not from_currency or not conv_currency:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
                'status': status.HTTP_400_BAD_REQUEST,
                'message': 'The from_currency and conv_currency fields are required.',
                }
    elif not start_date and not end_date:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
                'status': status.HTTP_400_BAD_REQUEST,
                'message': 'The start_date and end_date fields are required.',
        }


    chart = await create_chart(from_currency, conv_currency, start_date, end_date)

    if not chart:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {'message': 'No data found.', 'status_code': status.HTTP_404_NOT_FOUND}

    host = request.headers.get("host")
    url_schema = request.url.scheme

    return {
                'status': status.HTTP_400_BAD_REQUEST,
                'message': f'{url_schema}://{host}/static/charts/{chart}.png',
            }


@app.get("/api/getChart/{period}", status_code=status.HTTP_201_CREATED)
async def get_chart_period(
                            response: Response,
                            request: Request,
                           ):

    from_currency, conv_currency, period = None, None, None

    if not from_currency or not conv_currency:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
                'status': status.HTTP_400_BAD_REQUEST,
                'message': 'The from_currency and conv_currency fields are required.',
                }

    if period not in ['week', 'month', 'quarter', 'year']:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {'message': 'Invalid period.', 'status_code': status.HTTP_400_BAD_REQUEST}

    days, month, years = 0, 0, 0

    if period == 'week':
        days = -7
    elif period == 'month':
        month = -1
    elif period == 'quarter':
        month = -3
    elif period == 'year':
        years = -1

    end_date = datetime.datetime.now()
    start_date = end_date + dateutil.relativedelta.relativedelta(months=month, days=days, years=years)

    chart = await create_chart(from_currency,
                               conv_currency,
                               start_date.strftime('%Y-%m-%d'),
                               end_date.strftime('%Y-%m-%d')
                               )

    if not chart:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {'message': 'No data found.', 'status_code': status.HTTP_404_NOT_FOUND}

    host = request.headers.get("host")
    url_schema = request.url.scheme

    return {
            'status': status.HTTP_201_CREATED,
            'message': f'{url_schema}://{host}/static/charts/{chart}.png',
            }


async def create_chart(from_currency: str, conv_currency: str, start_date: str, end_date: str) -> (str, bool):
    cur.execute('SELECT date, rate FROM currency WHERE (date BETWEEN %s AND %s) '
                'AND from_currency = %s AND conv_currency = %s ORDER BY date',
                [
                    start_date, end_date,
                    from_currency.upper(), conv_currency.upper()
                ])

    con.commit()
    data = cur.fetchall()

    if not data or len(data) <= 1:
        return

    date, rate = [], []

    for i in range(len(data)):
        date.append(str(data[i][0]))
        rate.append(data[i][1])

    if rate[0] < rate[-1]:
        plt.plot(date, rate, color='green')
    elif rate[0] > rate[-1]:
        plt.plot(date, rate, color='red')
    else:
        plt.plot(date, rate, color='grey')

    plt.xlabel('Date')
    plt.ylabel('Rate')

    fig = plt.gcf()
    fig.set_size_inches(18.5, 9.5)

    name = await generate_unique_name(
                                f'{from_currency.upper()}_{conv_currency.upper()}',
                                datetime.datetime.now()
                                )

    fig.savefig(f'../charts/{name}.png')
    fig.clear()

    return name


async def generate_unique_name(currency_pair: str, date: datetime) -> str:
    date_str = date.strftime("%Y%m%d")
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    unique_name = f"{currency_pair}_{date_str}_{random_suffix}"

    return unique_name


if __name__ == '__main__':
    uvicorn.run(app,
                host=config['server']['host'],
                port=3030,
                ssl_keyfile=config['server']['ssl']['private_key']
                if config['server']['ssl']['work']
                else None,
                ssl_certfile=config['server']['ssl']['cert']
                if config['server']['ssl']['work']
                else None
                )
