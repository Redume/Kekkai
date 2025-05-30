"""
Module for generating smoothed currency exchange rate charts.

This module provides an asynchronous function to create a visual
representation of historical currency exchange rates. The function
uses spline interpolation to smooth data points and matplotlib
to generate a JPEG chart image returned as a binary stream.

It requires the Currency schema for input parameters and uses
matplotlib and scipy for plotting and interpolation.
"""
from datetime import datetime
from typing import Optional
from io import BytesIO

from matplotlib import pyplot as plt
from scipy.interpolate import make_interp_spline
import numpy as np

from schemas.currency import Currency
from database.server import Database
from utils.config.load_config import load_config
from utils.config.get_dsn import get_dsn

config = load_config('config.hjson')

async def create_chart(currency: Currency, dates: list, rates: list) -> Optional[BytesIO]:
    """
    Generates a smoothed currency exchange rate chart image 
    from historical data.

    This asynchronous function receives historical exchange rate data 
    for aspecified currency pair over a given date range. 
    It applies spline interpolation to smooth the rate curve, 
    then creates a matplotlib plot
    with formatted date labels on the x-axis. The resulting plot is saved
    as a JPEG image in a binary stream.

    Args:
        currency (Currency): An object containing details about 
            the currency pair and period.
        dates (list): A list of datetime objects 
        representing the dates of the data points.
        rates (list):  A list of float values representing 
            exchange rates corresponding to the dates.

    Returns:
        Optional[BytesIO]: A binary stream containing 
            the JPEG image of the chart,
        or None if the interpolation fails or there is insufficient data.
    """
    print(dates)
    x_values = np.arange(len(dates))
    try:
        spline = make_interp_spline(x_values, rates, k=2)
    except ValueError:
        return None

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

    buf = BytesIO()
    fig.savefig(buf, format="jpeg", bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)

    return buf
