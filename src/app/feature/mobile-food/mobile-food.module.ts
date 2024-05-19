import { Module } from '@nestjs/common';

import { MobileFoodController } from './controllers/mobile-food.controller';
import { MobileFoodService } from './services/mobile-food.service';

@Module({
    imports: [],
    controllers: [MobileFoodController],
    providers: [MobileFoodService],
})
export class MobileFoodModule {}
