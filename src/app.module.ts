import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { DestinosModule } from './modules/destinos/destinos.module';
import { PaquetesModule } from './modules/paquetes/paquetes.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { AdminModule } from './modules/admin/admin.module';
import { UploadModule } from './modules/upload/upload.module';
import { ConfiguracionModule } from './modules/configuracion/configuracion.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    DestinosModule,
    PaquetesModule,
    ClientesModule,
    AdminModule,
    UploadModule,
    ConfiguracionModule,
  ],
})
export class AppModule {}
