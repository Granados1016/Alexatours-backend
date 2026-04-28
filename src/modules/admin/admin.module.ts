import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { Destino } from '../destinos/entities/destino.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Reserva } from '../reservas/entities/reserva.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paquete, Destino, Cliente, Reserva])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
