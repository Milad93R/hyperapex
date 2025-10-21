import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello from NestJS backend integrated with Next.js!';
  }

  getHealth(): { status: string; timestamp: string; service: string } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'NestJS Backend Service'
    };
  }

  echo(data: any): { message: string; data: any; source: string } {
    return {
      message: 'Echo from NestJS backend service',
      data,
      source: 'NestJS Backend'
    };
  }
}