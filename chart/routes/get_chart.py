"""
Module for handling currency exchange rate chart requests.

This module defines an API route that processes requests for historical 
exchange rate data visualization. It validates request parameters, fetches 
data, and returns a formatted chart response.
"""
from datetime import datetime
from dateutil.relativedelta import relativedelta

from fastapi import APIRouter, status, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse

from schemas.currency import Currency
from function.create_chart import create_chart

router = APIRouter()

@router.get('/api/getChart/', status_code=status.HTTP_200_OK)
async def get_chart(req: Request, currency: Currency = Depends()) -> StreamingResponse:
    """
    Endpoint for retrieving a currency exchange rate chart.

    This endpoint generates a chart based on historical exchange rate data
    for a given currency pair within a specified date range.

    Route:
        GET /api/getChart/

    Query Parameters:
        - from_currency (str): The base currency code.
        - conv_currency (str): The target currency code.
        - start_date (datetime): The start date 
            of the exchange rate data range.
        - end_date (datetime): The end date 
            of the exchange rate data range.

    Responses:
        - 201 Created: Returns the generated chart data.
        - 400 Bad Request: If required parameters are missing or invalid.
    """
    if not currency.from_currency or not currency.conv_currency:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='The from_currency and conv_currency fields are required.'
        )

    days, month, years = 0, 0, 0

    if currency.period:
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
    else:
        if not currency.start_date or not currency.end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The start_date and end_date fields are required.'
            )

        if currency.start_date > currency.end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The start_date cannot be later than the end_date.'
            )

    chart = await create_chart(currency, req.app.state.db)

    if chart is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='No data found.'
        )

    return StreamingResponse(chart, media_type="image/jpeg")
