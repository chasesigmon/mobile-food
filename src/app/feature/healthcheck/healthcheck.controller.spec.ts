import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { HealthCheckController } from './healthcheck.controller';

describe('HealthCheckController', () => {
    let controller: HealthCheckController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthCheckController],
            providers: [ConfigService],
        }).compile();

        controller = module.get<HealthCheckController>(HealthCheckController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
