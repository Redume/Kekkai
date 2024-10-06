import os
import psycopg2
import uvicorn
import yaml
import matplotlib.pyplot as plt
from fastapi import FastAPI, Response, status
from psycopg2.extras import DictCursor
from starlette.staticfiles import StaticFiles

app = FastAPI()

config = yaml.safe_load(open('../config.yaml'))

con = psycopg2.connect(host=config['database']['host'],
                       user=config['database']['user'],
                       password=config['database']['password'],
                       database=config['database']['name'],
                       port=config['database']['port'])

cur = con.cursor(cursor_factory=DictCursor)
con.autocommit = True

app.mount('/static/charts', StaticFiles(directory='../charts/'))


@app.get("/api/getChart/")
async def get_chart(response: Response,
                    from_currency: str, conv_currency: str,
                    start_date: str, end_date: str):
    """
    :param response:
    :param from_currency: The currency to convert from
    :type from_currency: str
    :param conv_currency: The currency to be converted into
    :type conv_currency: str
    :param start_date: The start date of the schedule period
    :type start_date: str
    :param end_date: The last date of the schedule period
    :type end_date: str
    :return:
    """
    cur.execute('SELECT date, rate FROM currency WHERE (date BETWEEN %s AND %s) '
                'AND from_currency = %s AND conv_currency = %s ORDER BY date',
                [
                    start_date, end_date,
                    from_currency.upper(), conv_currency.upper()
                ])
    con.commit()
    data = cur.fetchall()

    if not data:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {'message': 'No data found', 'status_code': status.HTTP_404_NOT_FOUND}

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

    if not os.path.exists('../charts'):
        os.mkdir('../charts')

    fig.savefig(f'../charts/{from_currency}-{conv_currency}.png')
    fig.clear()

    return {'message': f'./static/charts/{from_currency}-{conv_currency}.png',
            'status_code': status.HTTP_201_CREATED,
            }


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
