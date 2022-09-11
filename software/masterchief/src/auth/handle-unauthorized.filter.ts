import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';

@Catch(UnauthorizedException)
export class HandleUnauthorizedFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (ctx.contextType === 'graphql') {
      throw new UnauthorizedException();
    }
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).redirect('/auth/login');
  }
}
