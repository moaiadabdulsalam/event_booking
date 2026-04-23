import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { traceStorage } from '../tracing/trace-context';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const traceId = randomUUID();
    const start = Date.now();

    return traceStorage.run({ traceId }, () => {
      this.logger.log(
        `[START] ${req.method} ${req.url} traceId=${traceId}`,
      );

      return next.handle().pipe(
        tap({
          next: () => {
            const duration = Date.now() - start;
            this.logger.log(
              `[END] ${req.method} ${req.url} ${duration}ms traceId=${traceId}`,
            );
          },
          error: (err) => {
            const duration = Date.now() - start;
            this.logger.error(
              `[ERROR] ${req.method} ${req.url} ${duration}ms traceId=${traceId} message=${err.message}`,
            );
          },
        }),
      );
    });
  }
}