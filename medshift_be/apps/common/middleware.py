import logging

from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger("django.request")


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log standard request/response information.
    """
    def process_request(self, request):
        setattr(request, "_logging_metadata", {
            "path": request.path,
            "method": request.method,
            "user_id": request.user.id if hasattr(request, "user") and request.user.is_authenticated else None,
            "tenant": getattr(request, "tenant", None),
        })

    def process_response(self, request, response):
        meta = getattr(request, "_logging_metadata", {})
        status_code = response.status_code

        log_msg = f"{meta.get('method', 'UNKNOWN')} {meta.get('path', 'UNKNOWN')} {status_code}"
        
        if status_code >= 500:
            logger.error(log_msg, extra={"request_meta": meta})
        elif status_code >= 400:
            logger.warning(log_msg, extra={"request_meta": meta})
        else:
            logger.info(log_msg, extra={"request_meta": meta})
            
        return response
