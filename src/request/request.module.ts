import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { request, Request } from './schema/request-schema';
// import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Singnup, authSchema } from 'src/auth/schema/auth-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Request.name,
        schema: request
      },
      {
        name: Singnup.name,
        schema: authSchema
      }
    ])
  ],
  controllers: [RequestController],
  providers: [RequestService],

  exports: [
    MongooseModule
  ]
})

export class RequestModule {}