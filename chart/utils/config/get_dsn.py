"""Load DSN for database"""

from typing import Any, Dict


def get_dsn(config: Dict[str, Any]) -> str:
    """
    Forms a DSN to connect to PostgreSQL from the configuration.

    Params: config (dict): Dictionary with configuration.

    Returns str: DSN string.
    """
    # pylint: disable=consider-using-f-string
    return "postgresql://{user}:{password}@{host}:{port}/{name}".format(**config)
