import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { MobileFoodService } from '../services/mobile-food.service';
import { MobileFoodController } from './mobile-food.controller';

jest.mock('axios', () => {
    return {
        create: jest.fn(() => axios),
        post: jest.fn(() => Promise.resolve()),
    };
});

const mobileFoodFacility1 = {
    locationid: '1735061',
    Applicant: "Bay Area Mobile Catering, Inc. dba. Taqueria Angelica's",
    FacilityType: 'Truck',
    cnn: '2471000',
    LocationDescription: 'CESAR CHAVEZ ST: INDIANA ST to IOWA ST (1300 - 1399)',
    Address: '1301 CESAR CHAVEZ ST',
    blocklot: '4352007',
    block: '4352',
    lot: '007',
    permit: '23MFF-00031',
    Status: 'APPROVED',
    FoodItems: 'Tacos: Burritos: Tortas: Quesadillas: Sodas: Chips: Candy',
    X: '6014982.06972',
    Y: '2100806.30269',
    Latitude: '37.74925585952909',
    Longitude: '-122.39097537957679',
    Schedule:
        'http://bsm.sfdpw.org/PermitsTracker/reports/report.aspx?title=schedule&report=rptSchedule&params=permit=23MFF-00031&ExportPDF=1&Filename=23MFF-00031_schedule.pdf',
    dayshours: '',
    NOISent: '',
    Approved: '10/26/2023 12:00:00 AM',
    Received: '20231019',
    PriorPermit: '1',
    ExpirationDate: '11/15/2024 12:00:00 AM',
    Location: '(37.74925585952909, -122.39097537957679)',
    'Fire Prevention Districts': '10',
    'Police Districts': '3',
    'Supervisor Districts': '8',
    'Zip Codes': '58',
    'Neighborhoods (old)': '1',
};

const mobileFoodFacility2 = {
    locationid: '1750910',
    Applicant: "The New York Frankfurter Co. of CA, Inc. DBA: Annie's Hot Dogs",
    FacilityType: 'Push Cart',
    cnn: '8747202',
    LocationDescription:
        'MARKET ST: 04TH ST \\ ELLIS ST \\ STOCKTON ST to POWELL ST (800 - 890) -- NORTH --',
    Address: '870 MARKET ST',
    blocklot: '0329005',
    block: '0329',
    lot: '005',
    permit: '23MFF-00056',
    Status: 'APPROVED',
    FoodItems:
        'Soft pretzels: hot dogs: sausages: chips: popcorn: soda: espresso: cappucino: pastry: ica cream: ices: italian sausage: shish-ka-bob: churros: juice: water: various drinks',
    X: '6010493.859',
    Y: '2113955.658',
    Latitude: '37.78511092044776',
    Longitude: '-122.40742266827704',
    Schedule:
        'http://bsm.sfdpw.org/PermitsTracker/reports/report.aspx?title=schedule&report=rptSchedule&params=permit=23MFF-00056&ExportPDF=1&Filename=23MFF-00056_schedule.pdf',
    dayshours: '',
    NOISent: '',
    Approved: '01/26/2024 12:00:00 AM',
    Received: '20231229',
    PriorPermit: '1',
    ExpirationDate: '11/15/2024 12:00:00 AM',
    Location: '(37.78511092044776, -122.40742266827704)',
    'Fire Prevention Districts': '14',
    'Police Districts': '10',
    'Supervisor Districts': '10',
    'Zip Codes': '28852',
    'Neighborhoods (old)': '6',
};

describe('MobileFoodController', () => {
    let mobileFoodController: MobileFoodController;

    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [MobileFoodController],
            providers: [MobileFoodService, ConfigService],
        }).compile();

        mobileFoodController =
            app.get<MobileFoodController>(MobileFoodController);
    });

    it('controller should be defined', () => {
        expect(mobileFoodController).toBeDefined();
    });

    describe('list()', () => {
        it('should succeed and return with a list of mobile food facilities', async () => {
            const json = [mobileFoodFacility1, mobileFoodFacility2];
            const csv = jsonToCsv(json);
            axios.get = jest.fn().mockResolvedValue({
                data: csv,
            });
            const result = await mobileFoodController.list();
            expect(result).toBeDefined();
            expect(result.length).toEqual(json.length);
            expect(result[0].applicant).toBeDefined();
            expect(result[0].locationid).toBeDefined();
            expect(result[0].fooditems).toBeUndefined();
        });

        it('should succeed and return with an empty list of mobile food facilities when the offset is higher than the result count', async () => {
            const json = [mobileFoodFacility1, mobileFoodFacility2];
            const csv = jsonToCsv(json);
            axios.get = jest.fn().mockResolvedValue({
                data: csv,
            });
            const result = await mobileFoodController.list({
                offset: 100,
            });
            expect(result).toBeDefined();
            expect(result.length).toEqual(0);
        });

        it('should succeed and return with a list of mobile food facilities with extra fields and offset by 1', async () => {
            const json = [mobileFoodFacility1, mobileFoodFacility2];
            const csv = jsonToCsv(json);
            axios.get = jest.fn().mockResolvedValue({
                data: csv,
            });
            const result = await mobileFoodController.list({
                fields: 'fooditems,facilitytype',
                offset: 1,
            });
            expect(result).toBeDefined();
            expect(result.length).toEqual(1);
            expect(result[0].applicant).toBeDefined();
            expect(result[0].locationid).toBeDefined();
            expect(result[0].fooditems).toBeDefined();
            expect(result[0].facilitytype).toBeDefined();
            expect(result[0].locationid).toEqual(
                mobileFoodFacility2.locationid
            );
            expect(result[1]?.applicant).toBeUndefined();
            expect(result[1]?.locationid).toBeUndefined();
        });

        it('should succeed and return with a list of mobile food facilities with a filter and sortDir DESC and limit of 1', async () => {
            const json = [mobileFoodFacility1, mobileFoodFacility2];
            const csv = jsonToCsv(json);
            axios.get = jest.fn().mockResolvedValue({
                data: csv,
            });
            const result = await mobileFoodController.list({
                filter: '{ "facilitytype": "Push Cart" }',
                sortDir: 'DESC',
                limit: 1,
            });
            expect(result).toBeDefined();
            expect(result.length).toEqual(1);
            expect(result[0].applicant).toBeDefined();
            expect(result[0].locationid).toBeDefined();
            expect(result[0].locationid).toEqual(
                mobileFoodFacility2.locationid
            );
            expect(result[1]?.applicant).toBeUndefined();
            expect(result[1]?.locationid).toBeUndefined();
        });

        it('should suceed and return with a list of mobile food facilities with an invalid filter', async () => {
            const json = [mobileFoodFacility1, mobileFoodFacility2];
            const csv = jsonToCsv(json);
            axios.get = jest.fn().mockResolvedValue({
                data: csv,
            });
            const result = await mobileFoodController.list({
                filter: 'test!!!#$#@$@#$',
            });
            expect(result).toBeDefined();
            expect(result.length).toEqual(json.length);
        });
    });

    describe('getByLocationId()', () => {
        it('should succeed and return with a single mobile food facility', async () => {
            const json = [mobileFoodFacility1, mobileFoodFacility2];
            const csv = jsonToCsv(json);
            axios.get = jest.fn().mockResolvedValue({
                data: csv,
            });
            const result = await mobileFoodController.getByLocationId({
                locationId: mobileFoodFacility1.locationid,
            });
            expect(result).toBeDefined();
            expect(result.applicant).toBeDefined();
            expect(result.locationid).toBeDefined();
        });
    });
});

const jsonToCsv = (jsonData: any) => {
    const replacer = (key: any, value: any) => (value === null ? '' : value);
    const header = Object.keys(jsonData[0]);
    const csv = [
        header.join(','), // header row first
        ...jsonData.map((row: any) =>
            header
                .map((fieldName) => JSON.stringify(row[fieldName], replacer))
                .join(',')
        ),
    ].join('\r\n');

    return csv;
};
