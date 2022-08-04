import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import { HandleUnauthorizedFilter } from './auth/handle-unauthorized.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './app/utils/logging.interceptor';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.engine(
    'hbs',
    engine({
      extname: 'hbs',
      defaultLayout: 'layout',
      layoutsDir: join(__dirname, '..', 'views', 'layouts'),
      partialsDir: join(__dirname, '..', 'views', 'partials'),
      helpers: {
        testies() {
          return 'help';
        },
      },
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HandleUnauthorizedFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(cookieParser());

  app.disable('x-powered-by');

  app.enableCors({
    origin: 'http://localhost:3001',
    methods: '*',
    credentials: true,
  });

  const config = new DocumentBuilder().setTitle('Masterchief').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('listening on port 3000');
}
bootstrap();
