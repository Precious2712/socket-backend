import { Controller, Get } from '@nestjs/common';

@Controller('api/v2')
export class PingController {
    @Get('ping')
    ping() {
        return { alive: true, time: new Date() };
    }
}