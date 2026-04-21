from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """
    Custom exception handler that standardizes response format.
    Ensures all error responses have a consistent shape:
    {
        "error": {
            "type": "ExceptionClass",
            "detail": "Error message or dict of messages",
            "status_code": 400
        }
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            "error": {
                "type": exc.__class__.__name__,
                "detail": response.data,
                "status_code": response.status_code,
            }
        }
        response.data = custom_data

    return response
