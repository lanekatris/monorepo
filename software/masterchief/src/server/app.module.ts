import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { ViewModule } from './view.module';

@Module({
  imports: [ViewModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
