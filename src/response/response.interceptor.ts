import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { method, url, body, user } = request;

    const now = Date.now();

    return next.handle().pipe(
      map((response) => {
        const responseTime = Date.now() - now;
        const statusCode = context.switchToHttp().getResponse().statusCode;

        //logger
        this.logger.info({
          message: 'Request processed',
          reqIP: request.ip,
          method,
          url,
          statusCode,
          responseTime,
        });

        return {
          data: response,
          success: true,
        };
      }),
    );
  }
}
