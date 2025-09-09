import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { PublicModule } from './public/public.module';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().port().default(3000),
        CORS_ORIGINS: Joi.string()
          .required()
          .pattern(/^https?:\/\/[^,]+(,https?:\/\/[^,]+)*$/)
          .messages({
            'string.pattern.base':
              'CORS_ORIGINS must be comma-separated URLs (e.g., http://localhost:3000,https://example.com)',
            'any.required': 'CORS_ORIGINS is required',
          }),
        API_KEY: Joi.string().min(32).required().messages({
          'string.min': 'API_KEY must be at least 32 characters for security',
          'any.required': 'API_KEY is required',
        }),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    PublicModule,
    SecurityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
