import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Inject,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        exception instanceof HttpException
          ? exception.getResponse()
          : 'Internal server error',
    };

    // Log the error details
    this.logger.error({
      message: 'Exception occurred',
      statusCode: status,
      path: request.url,
      method: request.method,
      errorMessage:
        typeof errorResponse.message === 'string'
          ? errorResponse.message
          : JSON.stringify(errorResponse.message),
      stack: exception instanceof Error ? exception.stack : undefined,
      exception:
        exception instanceof Error ? undefined : JSON.stringify(exception),
    });

    response.status(status).send(errorResponse);
  }
}
