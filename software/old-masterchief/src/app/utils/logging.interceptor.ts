import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import http from 'http';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req: http.IncomingMessage = ctx.getRequest();
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const res: http.ServerResponse = ctx.getResponse();

        // GraphQL doesn't have req
        if (req) {
          this.logger.log(
            `[${req.method} ${req.url}] ${res.statusCode} ${
              Date.now() - start
            }ms`,
          );
        } else {
          this.logger.log(`/graphql`);
        }
      }),
    );
  }
}
