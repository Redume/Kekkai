"""Custon exception handler for fastapi"""
from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

async def custom_validation_exception(
    request: Request,
    exc: RequestValidationError
    ) -> JSONResponse:
    """
    Custom exception handler for request validation errors in FastAPI.

    Args:
        request (Request): The incoming HTTP request.
        exc (RequestValidationError): The validation error raised by FastAPI.

    Returns:
        JSONResponse: A JSON response containing the error details.
    """
    status_code = getattr(
        exc,
        "status_code",
        status.HTTP_422_UNPROCESSABLE_ENTITY
        )

    messages = [error.get("msg") for error in exc.errors()]
    detail = "; ".join(messages)
    return JSONResponse(
        status_code=status_code,
        content={"detail": detail}
    )
