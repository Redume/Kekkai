"""
This module provides functionality to generate currency rate charts
based on historical data retrieved from the database.
"""
from datetime import datetime
from typing import Optional

from matplotlib import pyplot as plt
from scipy.interpolate import make_interp_spline
import numpy as np

from schemas.currency import Currency
from database.server import Database
from utils.config.load_config import load_config
from utils.config.get_dsn import get_dsn
from function.gen_unique_name import generate_unique_name

config = load_config('config.hjson')

async def create_chart(currency: Currency, db: Database) -> Optional[str]:
    """
    Generates a currency exchange rate chart based on historical data.

    This function retrieves exchange rate data 
    from the database for a specified  currency pair and date range. 
    It applies interpolation to smooth the data 
    and generates a chart, which is saved as an image file.

    Args:
        currency (Currency): An object containing the currency pair 
            and date range.
        db (Database): An instance of the database connection.

    Returns:
        Optional[str]: The filename of the saved chart image, 
            or None if no data is available.
    """
    data = await db.fetchmany('SELECT date, rate FROM currency '
    'WHERE (date BETWEEN $1 AND $2) '
    'AND from_currency = $3 AND conv_currency = $4 ORDER BY date',
    currency.start_date,
    currency.end_date,
    currency.from_currency.upper(),
    currency.conv_currency.upper()
    )

    if not data:
        return None

    dates = [datetime.strptime(row["date"], '%Y-%m-%d') for row in data]
    rates = [row["rate"] for row in data]

    if len(dates) < 3:
        return None

    x_values = np.arange(len(dates))
    try:
        spline = make_interp_spline(x_values, rates, k=2)
    except ValueError as e:
        return None

    x_values = np.arange(len(dates))
    spline = make_interp_spline(x_values, rates, k=2)
    new_x = np.linspace(0, len(dates) - 1, 200)
    new_y = spline(new_x)

    fig, ax = plt.subplots(figsize=(15, 6))

    ax.set_xticks(np.linspace(0, len(dates) - 1, 10))

    current_year = datetime.now().year

    ax.set_xticklabels(
        [
            dates[int(i)].strftime('%m-%d') 
                if dates[int(i)].year == current_year
            else dates[int(i)].strftime('%Y-%m-%d')
            for i in np.linspace(0, len(dates) - 1, 10).astype(int)
        ],
    )

    ax.tick_params(axis='both', labelsize=10)

    if rates[0] < rates[-1]:
        color = 'green'
    elif rates[0] > rates[-1]:
        color = 'red'
    else:
        color = 'grey'

    ax.plot(new_x, new_y, color=color, linewidth=2)

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    name = await generate_unique_name(
        f'{currency.from_currency.upper()}_{currency.conv_currency.upper()}',
        datetime.now()
    )

    plt.savefig(f'../charts/{name}.png')
    plt.close(fig)

    return name
