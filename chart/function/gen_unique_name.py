import datetime
import random
import string


async def generate_unique_name(currency_pair: str, date: datetime) -> str:
    date_str = date.strftime("%Y%m%d")
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    unique_name = f"{currency_pair}_{date_str}_{random_suffix}"

    return unique_name
