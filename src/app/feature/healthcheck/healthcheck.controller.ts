import { Controller, Get, SetMetadata, VERSION_NEUTRAL } from '@nestjs/common';

import { GetHealthcheckDocs } from './healthcheck.controller.docs';
import { HealthCheckResponse } from './healthcheck.model';

@Controller({
    path: '/healthcheck',
    version: VERSION_NEUTRAL,
})
export class HealthCheckController {
    constructor() {}

    @Get()
    @GetHealthcheckDocs()
    healthcheck(): HealthCheckResponse {
        return {
            Date: Date.now(),
            Status: 'OK',
            ResponseType: 'HealthCheckResponse',
        };
    }
}
