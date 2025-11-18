import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { RequestModule } from './request/request.module';

import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

// import { PingController } from './Keep-Alive/ping.controller';
// import { KeepAliveService } from './Keep-Alive/keep-alive.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const url = configService.get<string>('MONGODB_URI');
        if (url) {
          console.log('🔗 Connecting to MongoDB with URI:');
        } else {
          console.log('No connection found');
        }
        return {
          uri: url
        }
      }
    }),

    AuthModule,

    ChatModule,

    RequestModule,

    // ScheduleModule.forRoot(),
    // HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}
