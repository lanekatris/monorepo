import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { RhinofitConfiguration } from '../configuration';
import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import request from 'request';
import { Cache } from 'cache-manager';

export class LoginRhinofitCommand {}

@CommandHandler(LoginRhinofitCommand)
export class LoginRhinofitHandler
  implements ICommandHandler<LoginRhinofitCommand>
{
  private readonly logger = new Logger(LoginRhinofitHandler.name);

  constructor(
    private config: ConfigService<RhinofitConfiguration>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(command: LoginRhinofitCommand): Promise<string[]> {
    const cookies = await this.cacheManager.get<string[]>('cookies');

    if (cookies) {
      this.logger.log(`Cached cookies found, returning them`);
      return cookies;
    }
    this.logger.log(`No cached cookies found, logging in...`);

    const { email, password } = this.config.get('rhinofit', { infer: true });

    return new Promise((resolve, reject) => {
      request.post(
        {
          url: 'https://my.rhinofit.ca/',
          formData: {
            email,
            password,
            rememberme: 'on',
          },
        },
        async (err, httpResponse) => {
          if (err) {
            return reject(err);
          }
          const newCookies = httpResponse.headers['set-cookie'];
          await this.cacheManager.set('cookies', newCookies);
          return resolve(newCookies);
        },
      );
    });
  }
}
