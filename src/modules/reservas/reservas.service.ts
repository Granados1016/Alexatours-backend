import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepo: Repository<Reserva>,
  ) {}

  findAll() {
    return this.reservaRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const reserva = await this.reservaRepo.findOne({ where: { id } });
    if (!reserva) throw new NotFoundException(`Reserva #${id} no encontrada`);
    return reserva;
  }

  create(dto: CreateReservaDto) {
    const reserva = this.reservaRepo.create(dto);
    return this.reservaRepo.save(reserva);
  }

  async update(id: number, dto: UpdateReservaDto) {
    await this.findOne(id);
    await this.reservaRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.reservaRepo.delete(id);
    return { message: `Reserva #${id} eliminada` };
  }
}
