import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KeepAliveService {
  private readonly logger = new Logger(KeepAliveService.name);

  private readonly baseUrl =
    'http://localhost:8000';

  constructor(private readonly http: HttpService) {}

  @Cron('*/10 * * * *') // every 10 minutes
  async keepAlive() {
    const target = `${this.baseUrl}/api/v2/ping`;

    if (!this.baseUrl) {
      this.logger.error('BASEURL or RENDER is not defined. Skipping ping.');
      return;
    }

    try {
      const res = await firstValueFrom(this.http.get(target));
      if (res.status === 200) {
        this.logger.log(`✅ Server pinged successfully → ${target}`);
      } else {
        this.logger.warn(`⚠️ Ping failed → ${res.status}`);
      }
    } catch (err) {
      this.logger.error(`❌ Error pinging server: ${err.message}`);
    }
  }
}
