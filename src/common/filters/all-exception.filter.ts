import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getHttpStatus(exception);
    const message = this.getErrorMessage(exception);
    const errorName = this.getErrorName(exception);

    // Extract user info if available
    const userId = (request as any).user?.id || 'anonymous';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      error: errorName,
    };

    // Categorize and log based on status code
    if (status >= 500) {
      // Server errors - CRITICAL
      this.logger.error(
        `🔥 CRITICAL ERROR - ${request.method} ${request.url} - Status: ${status} - User: ${userId}`,
        this.getDetailedErrorInfo(exception, request),
      );
    } else if (status >= 400) {
      // Client errors - WARNING
      this.logger.warn(
        `⚠️ CLIENT ERROR - ${request.method} ${request.url} - Status: ${status} - User: ${userId} - Message: ${message}`,
      );
    }

    // Log stack trace for debugging (only in development)
    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      this.logger.debug(`Stack Trace: ${exception.stack}`);
    }

    response.status(status).json(errorResponse);
  }

  private getHttpStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    
    // Handle database errors
    if (exception instanceof QueryFailedError) {
      return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      return (response as any).message || exception.message;
    }

    if (exception instanceof QueryFailedError) {
      return 'Database operation failed';
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }

  private getErrorName(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.constructor.name;
    }
    if (exception instanceof Error) {
      return exception.name;
    }
    return 'UnknownError';
  }

  private getDetailedErrorInfo(exception: unknown, request: Request): string {
    const details = {
      url: request.url,
      method: request.method,
      ip: request.ip,
      userAgent: request.get('user-agent'),
      userId: (request as any).user?.id || 'anonymous',
      body: this.sanitizeBody(request.body),
      query: request.query,
      params: request.params,
      errorName: this.getErrorName(exception),
      errorMessage: this.getErrorMessage(exception),
      stack: exception instanceof Error ? exception.stack : 'No stack trace',
    };

    return JSON.stringify(details, null, 2);
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return {};

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}