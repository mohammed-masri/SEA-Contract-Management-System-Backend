import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Constants } from 'src/config';

@Injectable()
export class ServerConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<T>(key: string) {
    return this.configService.get<T>(key);
  }

  getServerEnvironment() {
    return this.get<Constants.Server.Environments | undefined>('NODE_ENV');
  }
}
