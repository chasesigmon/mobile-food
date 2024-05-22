import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import AppModule from '../src/app/app.module';

describe('E2E HealthcheckController', () => {
    let app: INestApplication;
    const systemTime = new Date('2015-10-21');

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        jest.useFakeTimers();
        jest.setSystemTime(systemTime);
    });

    afterAll(async () => {
        jest.useRealTimers();
        await app.close();
    });

    describe('GET /healthcheck', () => {
        it('should return status 200 and OK status', async () => {
            const response = await request(app.getHttpServer()).get(
                '/healthcheck'
            );
            expect(response.body).toEqual({
                Date: systemTime.getTime(),
                ResponseType: 'HealthCheckResponse',
                Status: 'OK',
            });
        });
    });
});
