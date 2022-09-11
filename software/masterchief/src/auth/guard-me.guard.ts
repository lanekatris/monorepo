import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserValidator } from './user-validator.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GuardMe implements CanActivate {
  public static COOKIE_NAME = 'password';
  constructor(@Inject(UserValidator) private service: UserValidator) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const gqlExecutionContext = GqlExecutionContext.create(context);

    console.log('idk', gqlExecutionContext);

    const cookieValue =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      gqlExecutionContext.contextType === 'http'
        ? context.switchToHttp().getRequest().cookies[GuardMe.COOKIE_NAME]
        : gqlExecutionContext.getContext().req.cookies[GuardMe.COOKIE_NAME];

    if (this.service.validatePassword(cookieValue)) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
