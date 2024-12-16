"""
This module provides functionality to generate currency rate charts
based on historical data retrieved from the database.
"""

from datetime import datetime

from matplotlib import pyplot as plt

from function.gen_unique_name import generate_unique_name
from database.server import create_pool

async def create_chart(
        from_currency: str,
        conv_currency: str,
        start_date: str,
        end_date: str
) -> (str, None):
    """
    Generates a line chart of currency rates for a given date range.

    The chart shows the exchange rate trend between `from_currency` and
    `conv_currency` within the specified `start_date` and `end_date` range.
    The generated chart is saved as a PNG file, and the function returns the
    file name. If data is invalid or insufficient, the function returns `None`.

    Args:
        from_currency (str): The base currency (e.g., "USD").
        conv_currency (str): The target currency (e.g., "EUR").
        start_date (str): The start date in the format 'YYYY-MM-DD'.
        end_date (str): The end date in the format 'YYYY-MM-DD'.

    Returns:
        str | None: The name of the saved chart file, or `None` if the operation fails.
    """
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
    """
    Validates whether the provided string is a valid date in the format 'YYYY-MM-DD'.

    Args:
        date_str (str): The date string to validate.

    Returns:
        bool: `True` if the string is a valid date, `False` otherwise.
    """
    try:
        datetime.strptime(date_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False
