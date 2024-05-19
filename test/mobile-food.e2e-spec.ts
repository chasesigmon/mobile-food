import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import AppModule from '../src/app/app.module';

describe('E2E HealthcheckController', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /api/tracker', () => {
        it('should return status 200 and a list of mobile food facilities', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/tracker'
            );
            expect(response.body).toBeDefined();
            expect(response.statusCode).toEqual(HttpStatus.OK);
            expect(response.body.length).toEqual(10);
            expect(response.body[0].applicant).toBeDefined();
            expect(response.body[0].locationid).toBeDefined();
            expect(response.body[0].fooditems).toBeUndefined();
        });

        it('should return status 200 and an empty list of mobile food facilities when the offset is higher than the result count', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/tracker?offset=999'
            );
            expect(response.body).toBeDefined();
            expect(response.statusCode).toEqual(HttpStatus.OK);
            expect(response.body.length).toEqual(0);
        });

        it('should return status 200 and a list of mobile food facilities with extra fields and offset by 1', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/tracker?fields=fooditems,facilitytype&offset=1'
            );
            expect(response.body).toBeDefined();
            expect(response.statusCode).toEqual(HttpStatus.OK);
            expect(response.body.length).toEqual(10);
            expect(response.body[0].applicant).toBeDefined();
            expect(response.body[0].locationid).toBeDefined();
            expect(response.body[0].fooditems).toBeDefined();
            expect(response.body[0].facilitytype).toBeDefined();
            expect(response.body[0].dayshours).toBeUndefined();
        });

        it('should return status 200 and a list of mobile food facilities with a filter and sortDir DESC and limit of 1', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/tracker?filter={ "facilitytype": "Push Cart" }&sortDir=DESC&limit=1'
            );
            expect(response.body).toBeDefined();
            expect(response.statusCode).toEqual(HttpStatus.OK);
            expect(response.body.length).toEqual(1);
            expect(response.body[0].applicant).toBeDefined();
            expect(response.body[0].locationid).toBeDefined();
            expect(response.body[0].dayshours).toBeUndefined();
            expect(response.body[1]?.locationid).toBeUndefined();
        });

        it('should return status 200 with an invalid filter', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/tracker?filter=test!!!#$#@$@#$'
            );

            expect(response.body).toBeDefined();
            expect(response.statusCode).toEqual(HttpStatus.OK);
            expect(response.body.length).toEqual(10);
        });
    });

    describe('GET /api/tracker/:locationId', () => {
        it('should return status 200 and a single mobile food facility', async () => {
            const locationId = '1735061';
            const response = await request(app.getHttpServer()).get(
                `/api/tracker/${locationId}`
            );
            expect(response.body).toBeDefined();
            expect(response.statusCode).toEqual(HttpStatus.OK);
            expect(response.body.applicant).toBeDefined();
            expect(response.body.locationid).toBeDefined();
            expect(response.body.fooditems).toBeDefined();
            expect(response.body.address).toBeDefined();
            expect(response.body.dayshours).toBeDefined();
            expect(response.body.expirationdate).toBeDefined();
            expect(response.body.locationdescription).toBeDefined();
            expect(response.body.latitude).toBeDefined();
            expect(response.body.longitude).toBeDefined();
            expect(response.body.status).toBeDefined();
            expect(response.body.zipcodes).toBeDefined();
        });
    });
});
