
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SenderController } from './sender.controller';
import { SenderService } from './sender.service';
import { Sender, SenderSchema } from './schema/sender-schema';
import { Singnup, authSchema } from 'src/auth/schema/auth-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sender.name, schema: SenderSchema },
      { name: Singnup.name, schema: authSchema }
    ])
  ],

  controllers: [SenderController],
  providers: [SenderService],
  // exports: [SenderService]
})

export class SenderModule {}
