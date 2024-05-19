import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AxiosResponse } from 'axios';

import {
    GetByLocationIdParams,
    ListMobileFoodQuery,
    MobileFoodDocs,
    MobileFoodResponse,
} from '../models/mobile-food.model';
import { MobileFoodService } from '../services/mobile-food.service';

@Controller('/api/tracker')
export class MobileFoodController {
    constructor(private readonly mobileFoodService: MobileFoodService) {}

    @Get('')
    @MobileFoodDocs()
    @ApiOperation({
        summary: 'List of mobile food facilities',
        description:
            'Retrieve a list of mobile food facilities based in San Fancisco.',
    })
    @ApiOkResponse({
        type: MobileFoodResponse,
        description: 'OK',
        isArray: true,
    })
    async list(
        @Query() query?: ListMobileFoodQuery
    ): Promise<Array<MobileFoodResponse>> {
        return this.mobileFoodService.list(query);
    }

    @Get(':locationId')
    @MobileFoodDocs()
    @ApiOperation({
        summary: 'Mobile food facility by locationId',
        description: 'Retrieve a mobile food facility based on locationId.',
    })
    @ApiOkResponse({ type: MobileFoodResponse, description: 'OK' })
    async getByLocationId(
        @Param() params: GetByLocationIdParams
    ): Promise<MobileFoodResponse> {
        return this.mobileFoodService.getByLocationId(params.locationId);
    }
}
