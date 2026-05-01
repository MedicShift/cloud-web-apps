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

    const message =
      exceptionResponse && typeof exceptionResponse === 'object' && exceptionResponse['message']
        ? exceptionResponse['message']
        : exceptionResponse ?? 'Internal server error';

    const stack = this.resolveStack(exception);

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${status} | ${this.resolveErrorMessage(exception)}`,
        stack,
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} → ${status} | ${message}`);
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
