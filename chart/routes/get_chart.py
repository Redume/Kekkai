"""
This module contains the route for retrieving a chart based on a given currency pair and date range.
It defines the `/api/getChart/` endpoint that processes requests for generating charts.
"""
from fastapi import APIRouter, status, Request, Response
from pydantic import BaseModel

from function.create_chart import create_chart
from .get_chart_period import prepare_chart_response

router = APIRouter()

class ChartRequestParams(BaseModel):
    """
    A Pydantic model that represents the request parameters for generating a chart.
    This model is used to validate and group the request parameters: from_currency, conv_currency, start_date, and end_date.
    """
    from_currency: str
    conv_currency: str
    start_date: str
    end_date: str

@router.get("/api/getChart/", status_code=status.HTTP_201_CREATED)
async def get_chart(
        response: Response,
        request: Request,
        from_currency: str,
        conv_currency: str,
        start_date: str,
        end_date: str
):
    """
    Fetches a chart for a given currency pair and date range.

    :param response: The response object used for returning the HTTP response.
    :param request: The request object containing details about the incoming request.
    :param from_currency: The base currency for conversion.
    :param conv_currency: The target currency for conversion.
    :param start_date: The start date for the chart data.
    :param end_date: The end date for the chart data.
    :return: A chart or an error message if the request is invalid.
    """
    if not from_currency or not conv_currency:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            'status': status.HTTP_400_BAD_REQUEST,
            'message': 'The from_currency and conv_currency fields are required.',
        }

    if not start_date or not end_date:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            'status': status.HTTP_400_BAD_REQUEST,
            'message': 'The start_date and end_date fields are required.',
        }

    chart = await create_chart(
        from_currency,
        conv_currency,
        start_date,
        end_date
    )
    return await prepare_chart_response(response, request, chart)
