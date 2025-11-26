import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip, body } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    // Extract user info if authenticated
    const userId = (request as any).user?.id || 'anonymous';

    // Log incoming request
    this.logger.log(
      `📥 ${method} ${url} - User: ${userId} - IP: ${ip}`,
    );

    // Log request body for POST/PUT/PATCH (excluding sensitive data)
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const sanitizedBody = this.sanitizeBody(body);
      if (Object.keys(sanitizedBody).length > 0) {
        this.logger.debug(
          `Request Body: ${JSON.stringify(sanitizedBody)}`,
        );
      }
    }

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const { statusCode } = response;

        // Log successful response
        this.logger.log(
          `📤 ${method} ${url} ${statusCode} - ${duration}ms - User: ${userId}`,
        );

        // Log response data for debugging (only in development)
        if (process.env.NODE_ENV === 'development') {
          this.logger.debug(
            `Response: ${JSON.stringify(data).substring(0, 200)}...`,
          );
        }
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;

        // Error will be logged by exception filter
        this.logger.error(
          `❌ ${method} ${url} ${error.status || 500} - ${duration}ms - User: ${userId}`,
        );

        throw error;
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return {};

    const sanitized = { ...body };
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}