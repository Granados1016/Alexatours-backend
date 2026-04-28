import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paquete } from '../paquetes/entities/paquete.entity';
import { Destino } from '../destinos/entities/destino.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Reserva } from '../reservas/entities/reserva.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Paquete) private paqueteRepo: Repository<Paquete>,
    @InjectRepository(Destino) private destinoRepo: Repository<Destino>,
    @InjectRepository(Cliente) private clienteRepo: Repository<Cliente>,
    @InjectRepository(Reserva) private reservaRepo: Repository<Reserva>,
  ) {}

  async getStats() {
    const [paquetes, destinos, clientes, reservas, ultimosClientes] = await Promise.all([
      this.paqueteRepo.count({ where: { activo: true } }),
      this.destinoRepo.count({ where: { activo: true } }),
      this.clienteRepo.count(),
      this.reservaRepo.count(),
      this.clienteRepo.find({ order: { createdAt: 'DESC' }, take: 5 }),
    ]);

    return { paquetes, destinos, clientes, reservas, ultimosClientes };
  }
}
