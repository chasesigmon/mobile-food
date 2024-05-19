import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule } from 'nestjs-redoc';

import AppModule from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    const config = new DocumentBuilder()
        .setTitle('Mobile Food Tracker')
        .setDescription(
            'Service to track mobile food facilities in San Francisco.'
        )
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    await RedocModule.setup('/api', app, document, {});

    const port = process?.env?.PORT || 3000;
    const server = await app.listen(port);
}

bootstrap();
