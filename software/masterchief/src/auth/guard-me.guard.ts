import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserValidator } from './user-validator.service';

@Injectable()
export class GuardMe implements CanActivate {
  public static COOKIE_NAME = 'password';
  constructor(@Inject(UserValidator) private service: UserValidator) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (this.service.validatePassword(request.cookies[GuardMe.COOKIE_NAME])) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
