from datetime import date
from typing import Optional

from pydantic import BaseModel, Field, root_validator

class Currency(BaseModel):
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
    end_date: Optional[date] = Field(default=None, description='End of period')
    period: Optional[str] = Field(
        default=None,
        description='Date Period. ' \
        'Arguments week/month/quarter/year are accepted'
    )

    @root_validator(pre=True)
    def validate_period(cls, values):
        period = values.get('period')

        if period and period not in ['week', 'month', 'quarter', 'year']:
            raise ValueError(
                "Period must be one of 'week', 'month', 'quarter', or 'year'."
                )

        return values
