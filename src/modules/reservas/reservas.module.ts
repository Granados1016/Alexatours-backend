import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { ReservasService } from './reservas.service';
import { ReservasPublicController, ReservasAdminController } from './reservas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva])],
  controllers: [ReservasPublicController, ReservasAdminController],
  providers: [ReservasService],
  exports: [ReservasService],
})
export class ReservasModule {}
