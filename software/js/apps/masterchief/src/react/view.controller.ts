import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { parse } from 'url';

import { ViewService } from './view.service';

@Controller('/')
export class ViewController {
  constructor(private viewService: ViewService) {}

  // @Get('hey')
  // public idk(@Req() req: Request, @Res() res: Response) {
  //   res.send({ whoa: 'there' });
  // }

  @Get('home')
  public async showHome(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }

  @Get('_next*')
  public async assets(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }

  @Get('favicon.ico')
  public async favicon(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }
}