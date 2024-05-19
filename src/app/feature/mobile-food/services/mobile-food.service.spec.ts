import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MobileFoodService } from './mobile-food.service';

describe('MobileFoodService', () => {
    let mobileFoodService: MobileFoodService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [MobileFoodService, ConfigService],
        }).compile();

        mobileFoodService = app.get<MobileFoodService>(MobileFoodService);
    });

    it('service should be defined', () => {
        expect(mobileFoodService).toBeDefined();
    });
});
