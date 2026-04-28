import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USER', 'alexa_user'),
  password: configService.get<string>('DB_PASSWORD', ''),
  database: configService.get<string>('DB_NAME', 'alexa_tours'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // En producción SIEMPRE false — usar migraciones
  logging: configService.get<string>('NODE_ENV') === 'development',
  charset: 'utf8mb4',
});
