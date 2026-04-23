import { Injectable, Logger } from '@nestjs/common';
import { getTraceId } from '../tracing/trace-context';

@Injectable()
export class AppLogger {
  private readonly logger = new Logger('APP');

  log(message: string) {
    this.logger.log(`[traceId=${getTraceId()}] ${message}`);
  }

  error(message: string, trace?: string) {
    this.logger.error(`[traceId=${getTraceId()}] ${message}`, trace);
  }

  warn(message: string) {
    this.logger.warn(`[traceId=${getTraceId()}] ${message}`);
  }
}