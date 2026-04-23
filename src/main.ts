import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();



// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import serverlessExpress from '@vendia/serverless-express';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import express from 'express';

// let cachedServer: any;

// async function bootstrapServer() {
//   const expressApp = express();

//   const app = await NestFactory.create(
//     AppModule,
//     new ExpressAdapter(expressApp),
//   );

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

//   await app.init();

//   return serverlessExpress({ app: expressApp });
// }

// export const handler = async (req: any, res: any) => {
//   if (!cachedServer) {
//     cachedServer = await bootstrapServer();
//   }

//   return cachedServer(req, res);
// };