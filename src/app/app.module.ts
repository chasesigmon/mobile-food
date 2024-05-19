import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckModule } from './feature/healthcheck/healthcheck.module';
import { MobileFoodModule } from './feature/mobile-food/mobile-food.module';

@Module({
    imports: [ConfigModule.forRoot(), MobileFoodModule, HealthCheckModule],
    providers: [],
    controllers: [],
})
export default class AppModule {}
