import {
  Controller,
  Get,
  Inject,
  Logger,
  Render,
  UseGuards,
} from '@nestjs/common';
import { GuardMe } from '../auth/guard-me.guard';
import { UserValidator } from '../auth/user-validator.service';

@Controller()
@UseGuards(GuardMe)
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(@Inject(UserValidator) private service: UserValidator) {}

  @Get()
  @Render('root')
  root() {
    return {};
  }
}
