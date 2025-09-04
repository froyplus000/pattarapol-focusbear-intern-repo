import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggerErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerErrorInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip } = request;
    const userAgent = request.get('User-Agent') || '';
    const requestId = Math.random().toString(36).substr(2, 9);

    return next.handle().pipe(
      catchError((error: Error) => {
        // 🚨 Log the error with context
        this.logger.error(`❌ Error in ${method} ${url}`, {
          requestId,
          method,
          url,
          ip,
          userAgent,
          errorMessage: error.message,
          errorStack: error.stack,
          timestamp: new Date().toISOString(),
        });

        // 🔧 Transform error to consistent format
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (error instanceof HttpException) {
          status = error.getStatus();
          message = error.message;
        }

        // 📤 Return formatted error response
        const errorResponse = {
          success: false,
          statusCode: status,
          message,
          requestId,
          timestamp: new Date().toISOString(),
          path: url,
        };

        this.logger.error(`📤 Sending error response:`, errorResponse);

        return throwError(() => new HttpException(errorResponse, status));
      }),
    );
  }
}
