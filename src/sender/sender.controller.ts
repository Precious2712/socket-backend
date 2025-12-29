
import { Controller, Post, Body, Put, Param, Delete, Get } from '@nestjs/common';
import { SenderService } from './sender.service';
import { CreateSenderDto } from './dto/create-sender-dto';
import { UpdateSenderDto } from './dto/update-sender-dto';

@Controller('sender')
export class SenderController {
    constructor(private readonly senderService: SenderService) {}

    @Post('send')
    send(@Body() dto: CreateSenderDto) {
        return this.senderService.sendRequest(dto);
    }

    @Put('update/:id')
    update(@Param('id') id: string, @Body() dto: UpdateSenderDto) {
        return this.senderService.updateRequest(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Body('currentUserId') currentUserId: string) {
        return this.senderService.deleteRequest(id, currentUserId);
    }

    @Get('pending/:userId')
    getPending(@Param('userId') userId: string) {
        return this.senderService.getPendingRequestsForUser(userId);
    }

    @Get('sent/:userId')
    getSent(@Param('userId') userId: string) {
        return this.senderService.getSentRequestsForUser(userId);
    }

    @Get('friends/:userId')
    getFriends(@Param('userId') userId: string) {
        return this.senderService.getFriendsForUser(userId);
    }

    @Get('accepted-count/:userId')
    getAcceptedCount(@Param('userId') userId: string) {
        return this.senderService.getAcceptedCountForUser(userId);
    }
}
