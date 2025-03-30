from datetime import date

from pydantic import BaseModel, Field

class Currency(BaseModel):
    from_currency: str = Field(
        ...,
        description='Currencies from which conversion takes place'
        )
    conv_currency: str = Field(
        ...,
        description='Currency to which conversion takes place'
        )
    rate: float = Field(..., description='Currency rate')
    currency_date: date = Field(
        ...,
        alias='date',
        description='Currency rate date in the format YYYYY-MM-DD'
        )
