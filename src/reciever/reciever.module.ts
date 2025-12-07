import { Module } from '@nestjs/common';
import { RecieverController } from './reciever.controller';
import { RecieverService } from './reciever.service';

@Module({
  controllers: [RecieverController],
  providers: [RecieverService]
})
export class RecieverModule {}
