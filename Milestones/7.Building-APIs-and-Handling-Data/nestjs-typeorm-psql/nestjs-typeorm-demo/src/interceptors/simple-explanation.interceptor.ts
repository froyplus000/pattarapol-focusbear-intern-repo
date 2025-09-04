import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class SimpleExplanationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // ============ BEFORE PART ============
    console.log('🔥 STEP 1: Interceptor starts');

    const request = context.switchToHttp().getRequest<Request>();
    console.log('📝 STEP 2: Request info:', {
      method: request.method,
      url: request.url,
    });

    // ============ RUN THE ACTUAL FUNCTION ============
    console.log('🚀 STEP 3: About to run your route handler function...');

    return next.handle().pipe(
      tap((result) => {
        // ============ AFTER PART ============
        console.log('✅ STEP 4: Your function returned:', result);
        console.log('🎉 STEP 5: Interceptor is done!');
      }),
    );
  }
}
