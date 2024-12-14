from fastapi import APIRouter, status, Request, Response

from chart.function.create_chart import create_chart
from chart.routes.get_chart_period import prepare_chart_response

router = APIRouter()

@router.get("/api/getChart/", status_code=status.HTTP_201_CREATED)
async def get_chart(
        response: Response,
        request: Request,
        from_currency: str = None,
        conv_currency: str = None,
        start_date: str = None,
        end_date: str = None,
):

    if not from_currency or not conv_currency:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            'status': status.HTTP_400_BAD_REQUEST,
            'message': 'The from_currency and conv_currency fields are required.',
        }

    elif not start_date and not end_date:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            'status': status.HTTP_400_BAD_REQUEST,
            'message': 'The start_date and end_date fields are required.',
        }


    chart = await create_chart(from_currency, conv_currency, start_date, end_date)
    return await prepare_chart_response(response, request, chart)
