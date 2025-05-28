"""
This module provides a model for handling currency conversion operations.
"""
from datetime import date
from typing import Optional, Literal

from pydantic import BaseModel, Field

class Currency(BaseModel):
    """
    A model that describes the parameters for currency conversion.

    Attributes:
        from_currency (str): The currency to convert from.
        conv_currency (str): The currency to convert to.
        start_date (Optional[date]): The beginning date of the period.
        end_date (Optional[date]): The end date of the period.
        period (Optional[str]): A date period parameter 
            that can be 'week', 'month', 'quarter', or 'year'.
    """
    from_currency: str = Field(
        ...,
        description='Currencies from which conversion takes place'
    )
    conv_currency: str = Field(
        ...,
        description='Currency to which conversion takes place'
    )
    start_date: Optional[date] = Field(
        default=None,
        description='Beginnings of the period'
    )
    end_date: Optional[date] = Field(
        default=None,
        description='End of period'
    )
    period: Optional[Literal['week', 'month', 'quarter', 'year']] = Field(
        default=None,
        description='Date Period.' \
        'Arguments week/month/quarter/year are accepted'
    )
