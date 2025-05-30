"""
Module for generating currency exchange rate charts using Typst.

This module provides an asynchronous function that creates a currency
exchange rate chart based on historical data for a specified currency pair.
It compiles the chart using the Typst template engine and returns the chart
as a PNG image in a binary stream.

The function expects a list of datetime objects for dates and corresponding
exchange rates, along with currency details and display parameters.
"""
from datetime import datetime
from typing import Optional
from io import BytesIO
import json

import typst

from schemas.currency import Currency
from database.server import Database
from utils.config.load_config import load_config
from utils.config.get_dsn import get_dsn

config = load_config('config.hjson')

async def create_chart(
    currency: Currency,
    dates: list,
    rates: list
    ) -> Optional[BytesIO]:
    """
    Generates a currency exchange rate chart based on historical data.

    This function takes historical currency exchange rate data 
        for a specified period,
    prepares the data, and compiles a chart image using Typst.
    It returns a binary stream containing the chart image in PNG format.

    Args:
        currency (Currency): 
            An object containing currency pair details and settings.
        dates (list): 
            A list of datetime objects representing observation dates.
        rates (list): 
            A list of exchange rate values corresponding to the dates.

    Returns:
        Optional[BytesIO]: A binary stream 
            with the generated PNG chart imageб 
            or None if no data is available 
            or an error occurs during generation.
    """
    dpi = 1

    compiler = typst.Compiler('./typst_template/simple.typ', sys_inputs={
        "from_currency": currency.from_currency.upper(),
        "conv_currency": currency.conv_currency.upper(),
        "x": json.dumps([d.timestamp() for d in dates]),
        "y": json.dumps(rates),
        "dpi": str(dpi),
        "width": str(currency.width),
        "period": currency.period if currency.period is not None else ""
    })

    return BytesIO(compiler.compile(
        output=None,
        ppi=dpi,
        format="png"
    ))
