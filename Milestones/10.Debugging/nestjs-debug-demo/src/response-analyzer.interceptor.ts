import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PinoLogger } from 'nestjs-pino';
import { Request, Response } from 'express';

@Injectable()
export class ResponseAnalyzerInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        // Log response analysis
        const responseTime = Date.now() - startTime;
        this.logger.info(
          {
            method: request.method,
            url: request.url,
            statusCode: response.statusCode,
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString(),
          },
          'Response Analysis',
        );
      }),
      map((data: any) => {
        // Modify response - ensure no password fields are returned
        if (data && typeof data === 'object') {
          // Remove password field if it exists
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...sanitizedData } = data;

          // Add debug information to response
          const enhancedResponse = {
            ...sanitizedData,
            _debug: {
              requestId: `req_${Date.now()}`,
              timestamp: new Date().toISOString(),
              processedBy: 'ResponseAnalyzerInterceptor',
            },
          };

          this.logger.info(
            {
              originalData: data,
              modifiedData: enhancedResponse,
            },
            'Response Modified',
          );

          return enhancedResponse;
        }
        return data;
      }),
    );
  }
}
