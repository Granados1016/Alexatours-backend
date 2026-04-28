import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paquete } from './entities/paquete.entity';
import { PaquetesService } from './paquetes.service';
import { PaquetesController } from './paquetes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Paquete])],
  controllers: [PaquetesController],
  providers: [PaquetesService],
  exports: [PaquetesService],
})
export class PaquetesModule {}
