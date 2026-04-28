import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paquete } from './entities/paquete.entity';
import { CreatePaqueteDto } from './dto/create-paquete.dto';

@Injectable()
export class PaquetesService {
  constructor(
    @InjectRepository(Paquete)
    private readonly paqueteRepo: Repository<Paquete>,
  ) {}

  findAll() {
    return this.paqueteRepo.find({
      where: { activo: true },
      relations: ['destino'],
      order: { destacado: 'DESC', nombre: 'ASC' },
    });
  }

  findDestacados() {
    return this.paqueteRepo.find({
      where: { activo: true, destacado: true },
      relations: ['destino'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number) {
    const paquete = await this.paqueteRepo.findOne({ where: { id }, relations: ['destino'] });
    if (!paquete) throw new NotFoundException(`Paquete #${id} no encontrado`);
    return paquete;
  }

  async create(dto: CreatePaqueteDto) {
    const { destinoId, ...rest } = dto;
    const paquete = this.paqueteRepo.create({
      ...rest,
      ...(destinoId ? { destino: { id: destinoId } } : {}),
    });
    return this.paqueteRepo.save(paquete);
  }

  async update(id: number, dto: Partial<CreatePaqueteDto>) {
    await this.findOne(id);
    const { destinoId, ...rest } = dto;
    await this.paqueteRepo.update(id, {
      ...rest,
      ...(destinoId ? { destino: { id: destinoId } } : {}),
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.paqueteRepo.update(id, { activo: false });
    return { message: `Paquete #${id} desactivado` };
  }
}
