import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Singnup, authSchema } from './schema/auth-schema';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,

    MongooseModule.forFeature([
      {
        name: Singnup.name,
        schema: authSchema
      }
    ])
  ],

  controllers: [AuthController],
  providers: [AuthService],

  exports: [
    MongooseModule
  ]
})

export class AuthModule {}