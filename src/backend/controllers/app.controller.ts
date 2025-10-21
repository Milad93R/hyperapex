import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string; service: string } {
    return this.appService.getHealth();
  }

  @Post('echo')
  echo(@Body() body: any): { message: string; data: any; source: string } {
    return this.appService.echo(body);
  }
}