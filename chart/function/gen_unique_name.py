"""
This module provides a function to generate a unique name for src files.
"""
import datetime
import random
import string


async def generate_unique_name(currency_pair: str, date: datetime) -> str:
    """
    Generates a unique name for a chart file based on the currency pair,
    current date, and a random suffix.

    Args:
        currency_pair (str): A string representing the currency pair (e.g., "USD_EUR").
        date (datetime.datetime): The current datetime object.

    Returns:
        str: A unique name in the format "CURRENCYPAIR_YYYYMMDD_RANDOMSUFFIX".
    """
    date_str = date.strftime("%Y%m%d")
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    unique_name = f"{currency_pair}_{date_str}_{random_suffix}"

    return unique_name
