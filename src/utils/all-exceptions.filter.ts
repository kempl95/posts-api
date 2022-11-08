import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus, Logger,
} from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import { ValidationException } from './validation.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: AbstractHttpAdapter<any, any, any>,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const httpAdapter = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus = 400;
    let message = 'Server error';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = exception.getResponse().toString();
      Logger.debug(`Request processing error: ${exception.message}`);
    }
    else if (exception instanceof ValidationException) {
      httpStatus = exception.status;
      message = exception.message;
    }
    else if (exception instanceof Error) Logger.error(`Server error: ${exception.message}`);

    const responseBody = {
      statusCode: httpStatus,
      message: message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      method: httpAdapter.getRequestMethod(ctx.getRequest())
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
