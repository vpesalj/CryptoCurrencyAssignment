import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.message;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception.status === 404) {
      console.log(true);
      status = HttpStatus.BAD_REQUEST;
    }
    if (exception.status === HttpStatus.BAD_REQUEST) {
      status = HttpStatus.BAD_REQUEST;
    }
    response.status(status).json({
      statusCode: status,
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
