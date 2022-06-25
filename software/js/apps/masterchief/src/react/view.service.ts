import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import createServer from 'next';
import { NextServer } from 'next/dist/server/next';
import { Request, Response } from 'express';
import { join } from 'path';

@Injectable()
export class ViewService implements OnModuleInit {
  private server: NextServer;

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    try {
      console.log('hey the views', __dirname);
      this.server = createServer({
        dev: this.configService.get<string>('NODE_ENV') !== 'production',
        dir: join(__dirname),
      });
      await this.server.prepare();
    } catch (error) {
      console.error(error);
    }
  }

  handler(req: Request, res: Response) {
    return this.server.getRequestHandler()(req, res);
  }
}
