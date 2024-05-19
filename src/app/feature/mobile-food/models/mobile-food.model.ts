import { applyDecorators } from '@nestjs/common';
import { ApiProduces, ApiProperty, ApiTags } from '@nestjs/swagger';

export enum FieldsEnum {
    applicant = 'applicant',
    locationid = 'locationid',
    locationdescription = 'locationdescription',
    address = 'address',
    fooditems = 'fooditems',
    facilitytype = 'facilitytype',
    status = 'status',
    latitude = 'latitude',
    longitude = 'longitude',
    dayshours = 'dayshours',
    expirationdate = 'expirationdate',
    zipcodes = 'zipcodes',
    googlemapsurl = 'googlemapsurl',
}

export enum FilterEnum {
    applicant = 'applicant',
    foodItems = 'foodItems',
    facilitytype = 'facilityType',
    status = 'status',
    excludeexpired = 'excludeExpired',
}

export class ListMobileFoodQuery {
    @ApiProperty({
        type: String,
        required: false,
        description:
            'Optional property for comma separated fields to be included in the response.',
        example: 'facilitytype,latitude,longitude',
        default: 'applicant,locationId',
        enum: FieldsEnum,
    })
    fields?: string;

    @ApiProperty({
        type: String,
        required: false,
        description: 'Optional json property to modify fields to query by.',
        example:
            '{ "applicant": "Bay Area", "fooditems": "Hot dogs", "excludeExpired": true, "facilitytype": "Push Cart", "status": "REQUESTED" }',
        enum: FilterEnum,
    })
    filter?: string;

    @ApiProperty({
        type: String,
        required: false,
        description:
            'Optional property to change the sort direction for the response.',
        default: 'ASC',
        examples: ['ASC', 'DESC'],
    })
    // RULES:
    // auto sort by applicant name ASC (unless query differs)
    sortDir?: 'ASC' | 'DESC';

    @ApiProperty({
        type: Number,
        required: false,
        description:
            'Optional property to limit the number of results in the response.',
        default: 10,
        minimum: 0,
    })
    limit?: number;

    @ApiProperty({
        type: Number,
        required: false,
        description: 'Optional property to exclude a number of results.',
        default: 0,
        minimum: 0,
    })
    offset?: number;
}

export class GetByLocationIdParams {
    @ApiProperty({
        type: String,
        required: true,
        description: 'The locationid of the mobile food facility.',
    })
    locationId: string;
}

export class MobileFoodResponse {
    @ApiProperty({
        type: String,
        required: true,
        description: 'Location ID of the mobile food facility.',
    })
    locationid: string;

    @ApiProperty({
        type: String,
        required: true,
        description: 'Name of the business for the mobile food facility.',
    })
    applicant: string;

    @ApiProperty({
        type: String,
        required: false,
        description:
            'The type of mobile food facility. "Truck" or "Push Cart".',
    })
    facilitytype?: string;

    @ApiProperty({
        type: String,
        required: false,
        description:
            'Brief description of the location of the mobile food facility.',
    })
    locationdescription?: string;

    @ApiProperty({
        type: String,
        required: false,
        description: 'The address of the mobile food facility.',
    })
    address?: string;

    @ApiProperty({
        type: String,
        required: false,
        description: 'The permit status of the mobile food facility.',
    })
    status?: string;

    @ApiProperty({
        type: String,
        required: false,
        description:
            'Brief description of the food items offered at the mobile food facility.',
    })
    fooditems?: string;

    @ApiProperty({
        type: String,
        required: false,
        description: 'The latitude of the mobile food facility.',
    })
    latitude?: string;

    @ApiProperty({
        type: String,
        required: false,
        description: 'The longitude of the mobile food facility.',
    })
    longitude?: string;

    @ApiProperty({
        type: String,
        required: true,
        description: 'The hours of operation for the mobile food facility.',
    })
    dayshours: string;

    @ApiProperty({
        type: String,
        required: true,
        description:
            'The expiration date of the permit for the mobile food facility.',
    })
    expirationdate: string;

    @ApiProperty({
        type: String,
        required: false,
        description: 'The zip code of the mobile food facility.',
    })
    zipcodes?: string;

    @ApiProperty({
        type: String,
        required: false,
        description:
            'Link to a google maps page with the latitude and longitude of the mobile food facility.',
    })
    googlemapsurl?: string;
}

export const MobileFoodDocs = () =>
    applyDecorators(ApiTags('tracker'), ApiProduces('application/json'));
