import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as ejs from 'ejs';
import { join } from 'path';
import { Request, urlencoded ,json} from 'express';
import { createServer } from 'http';
import * as corsAnywhere from 'cors-anywhere';
import cors = require("cors")
import multer = require('multer');
async function bootstrap() {
  const app = await NestFactory.create< NestExpressApplication>(AppModule,{cors:true});

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // app.enableCors({
  //   origin: '0.0.0.0:3000',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: 'Content-Type,Authorization,cookie',
  // });
  // app.use(multer().any());
  // app.use(json({ limit: '5mb' }));
  // app.use(urlencoded({ limit: '5mb', extended: true }));
   await app.listen(3000);
  app.useStaticAssets(join(__dirname, '..', 'views'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
}
bootstrap();
