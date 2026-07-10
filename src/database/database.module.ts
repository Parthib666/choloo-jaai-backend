import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        host: configService.get<string>('DATABASE_HOST'),

        port: Number(
          configService.get<string>('DATABASE_PORT'),
        ),

        username: configService.get<string>(
          'DATABASE_USERNAME',
        ),

        password: configService.get<string>(
          'DATABASE_PASSWORD',
        ),

        database: configService.get<string>(
          'DATABASE_NAME',
        ),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}