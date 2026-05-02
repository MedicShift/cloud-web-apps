import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message = (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
        ? (exceptionResponse as Record<string, any>).message
        : (exceptionResponse ?? 'Internal server error')
    ) as string;

    const stack = this.resolveStack(exception);

    const logMessage = `${request.method} ${request.url} → ${status} | ${typeof message === 'object' ? JSON.stringify(message) : message}`;

    if (status >= 500) {
      this.logger.error(logMessage, stack);
    } else {
      this.logger.warn(logMessage);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private resolveErrorMessage(exception: unknown): string {
    if (exception instanceof AggregateError) {
      const causes = exception.errors?.map((e: Error) => e.message).join(', ');
      return `AggregateError: ${causes || exception.message}`;
    }
    if (exception instanceof Error) return exception.message;
    return String(exception);
  }

  private resolveStack(exception: unknown): string | undefined {
    if (exception instanceof AggregateError) {
      const innerStacks = exception.errors
        ?.map((e: Error, i: number) => `[${i}] ${e.stack ?? e.message}`)
        .join('\n');
      return innerStacks || exception.stack;
    }
    if (exception instanceof Error) return exception.stack;
    return undefined;
  }
}
