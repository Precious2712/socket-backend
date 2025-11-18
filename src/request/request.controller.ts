import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request-dto';

@Controller('request')
export class RequestController {
    constructor(private readonly requestService: RequestService) { }

    @Post('create')
    async createRequest(@Body() dto: CreateRequestDto) {
        return this.requestService.createFriendRequestList(dto);
    }

    @Put(':id/response')
    async updateResponse(
        @Param('id') id: string,
        @Body() body: { response: boolean }
    ) {
        return this.requestService.responseRequest(id, body.response);
    }

    @Put('user/:id/login')
    async updateLoginStatus(
        @Param('id') id: string,
        @Body() body: { login: boolean }
    ) {
        return this.requestService.setUserLoginStatus(id, body.login);
    }

    @Delete(':id')
    async deleteRequest(@Param('id') id: string) {
        return this.requestService.removeDocument(id);
    }

    @Get('search')
    async search(@Query() query: { loginUserId?: string; response?: string; reciever?: string }) {
        return this.requestService.searchField(query);
    }
}
