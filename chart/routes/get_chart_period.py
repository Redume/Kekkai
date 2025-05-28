"""
This module defines the route for fetching a chart for a specific currency pair and period.

It includes the endpoint `/api/getChart/{period}` which allows users to request a chart for
a given currency pair (from_currency and conv_currency)
over a specified time period (week, month, quarter, or year).
"""
from datetime import datetime
from dateutil.relativedelta import relativedelta

from fastapi import APIRouter, status, Request, HTTPException, Depends
from fastapi.responses import StreamingResponse

from function.create_chart import create_chart
from schemas.currency import Currency

# pylint: disable=duplicate-code
router = APIRouter()

@router.get("/api/getChart/{period}", status_code=status.HTTP_200_OK)
async def get_chart_period(
    req: Request,
    currency: Currency = Depends()
) -> StreamingResponse:
    """
    Fetches a chart for a given currency pair and a specific period.

    The period can be one of the following: 
        'week', 'month', 'quarter', 'year'.
    Based on the selected period, 
        it calculates the start date and retrieves the chart data.

    :param response: The response object used to set status and message.
    :param request: The request object used 
        to retrieve details of the incoming request.
    :param from_currency: The base currency in the pair (e.g., 'USD').
    :param conv_currency: The target currency in the pair (e.g., 'EUR').
    :param period: The time period for which the chart is requested
    (e.g., 'week', 'month', 'quarter', 'year').
    """
    if not currency.from_currency or not currency.conv_currency:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='The from_currency and conv_currency fields are required.'
        )

    days, month, years = 0, 0, 0

    match currency.period:
        case 'week':
            days = -7
        case 'month':
            month = -1
        case 'quarter':
            month = -3
        case 'year':
            years = -1

    currency.end_date = datetime.now()
    currency.start_date = currency.end_date + relativedelta(
        months=month,
        days=days,
        years=years
    )

    chart = await create_chart(currency, req.app.state.db)

    if chart is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='No data found.'
        )

    return StreamingResponse(chart, media_type="image/jpeg")
