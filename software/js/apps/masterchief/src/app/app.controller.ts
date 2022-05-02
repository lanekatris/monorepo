import { Controller, Get } from '@nestjs/common';

import {AppService, GetDataRequest, GetDataResponse} from './app.service';
import {QueryBus} from "@nestjs/cqrs";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly queryBus: QueryBus) {}

  @Get()
  async getData() {
    const result = await this.queryBus.execute(new GetDataRequest()) as GetDataResponse
    return result;
    // return this.appService.getData();
  }
}
