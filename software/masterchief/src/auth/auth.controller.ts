import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { LoginDto } from './login.dto';
import { UserValidator } from './user-validator.service';
import { GuardMe } from './guard-me.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(@Inject(UserValidator) private service: UserValidator) {}

  @Get('login')
  root(@Request() req, @Response() res) {
    if (this.service.validatePassword(req.cookies[GuardMe.COOKIE_NAME])) {
      this.logger.log(`Password in cookie is good, redirecting to /climb`);
      return res.redirect('/');
    }

    this.logger.log(`Password is wrong or doesn't exist, rendering login page`);
    return res.render('auth/login', { layout: false });
  }

  @Post('login')
  login(@Response() res, @Body() input: LoginDto) {
    if (this.service.validatePassword(input.password)) {
      this.logger.log(`Password valid, writing cookie`);
      res.cookie(GuardMe.COOKIE_NAME, input.password);
    }

    this.logger.log(`Redirecting to homepage`);
    return res.redirect('/');
  }

  @Get('logout')
  logout(@Response() res) {
    res.clearCookie(GuardMe.COOKIE_NAME);
    return res.redirect('/');
  }
}
