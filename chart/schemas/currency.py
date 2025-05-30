"""
Module defining the Currency model for currency conversion parameters.

This module provides a Pydantic BaseModel describing the input parameters
required for currency conversion operations, including currency codes,
date range or predefined period, output image dimensions, and the chart
rendering backend option.

The model ensures validation and documentation of input data used in
currency exchange rate queries and chart generation.
"""

from datetime import date
from typing import Optional, Literal

from pydantic import BaseModel, Field


class Currency(BaseModel):
    """
    Model representing parameters for currency conversion queries.

    Attributes:
        from_currency (str): The source currency code for conversion.
        conv_currency (str): The target currency code for conversion.
        start_date (Optional[date]): The start date of the query period.
        end_date (Optional[date]): The end date of the query period.
        period (Optional[Literal['week', 'month', 'quarter', 'year']]):
            Optional preset period to specify the range.
            Acceptable values are 'week', 'month', 'quarter', or 'year'.
            If provided, overrides start_date and end_date.
        width (Optional[int]): Width of the output chart in pixels.
            Default is 1024.
        height (Optional[int]): Height of the output chart in pixels.
            Default is 1024.
        backend (Optional[Literal['matplotlib', 'typst']]):
            Specifies the rendering backend for chart generation.
            Default is 'matplotlib'.
    """

    from_currency: str = Field(
        ..., description="Currencies from which conversion takes place"
    )
    conv_currency: str = Field(
        ..., description="Currency to which conversion takes place"
    )
    start_date: Optional[date] = Field(
        default=None, description="Beginnings of the period"
    )
    end_date: Optional[date] = Field(default=None, description="End of period")
    period: Optional[Literal["week", "month", "quarter", "year"]] = Field(
        default=None,
        description="Date Period." "Arguments week/month/quarter/year are accepted",
    )
    width: Optional[int] = Field(
        default=1024,
    )
    height: Optional[int] = Field(
        default=1024,
    )
    backend: Optional[Literal["matplotlib", "typst"]] = Field(
        default="matplotlib", description="The backend used to create the graph"
    )
