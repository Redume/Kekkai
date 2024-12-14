from datetime import datetime

from matplotlib import pyplot as plt

from chart.function.gen_unique_name import generate_unique_name
from ..database.server import create_pool

async def create_chart(from_currency: str, conv_currency: str, start_date: str, end_date: str) -> (str, None):
    pool = await create_pool()

    if not validate_date(start_date) or not validate_date(end_date):
        return None

    start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
    end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()

    async with pool.acquire() as conn:
        data = await conn.fetch(
            'SELECT date, rate FROM currency '
            'WHERE (date BETWEEN $1 AND $2) AND from_currency = $3 AND conv_currency = $4',
            start_date_obj,
            end_date_obj,
            from_currency.upper(),
            conv_currency.upper()
        )

    if not data or len(data) <= 1:
        return None

    date, rate = [], []

    for row in data:
        date.append(str(row['date']))
        rate.append(row['rate'])

    if rate[0] < rate[-1]:
        plt.plot(date, rate, color='green', marker='o')
    elif rate[0] > rate[-1]:
        plt.plot(date, rate, color='red', marker='o')
    else:
        plt.plot(date, rate, color='grey')

    plt.xlabel('Date')
    plt.ylabel('Rate')

    fig = plt.gcf()
    fig.set_size_inches(18.5, 9.5)

    name = await generate_unique_name(
        f'{from_currency.upper()}_{conv_currency.upper()}',
        datetime.now()
    )

    fig.savefig(f'../charts/{name}.png')
    fig.clear()

    return name


def validate_date(date_str: str) -> bool:
    try:
        datetime.strptime(date_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False
