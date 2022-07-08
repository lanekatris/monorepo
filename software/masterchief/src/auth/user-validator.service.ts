import { Injectable } from '@nestjs/common';

@Injectable()
export class UserValidator {
  validatePassword(password: string): boolean {
    return process.env.APP_PASSWORD === password;
  }
}
