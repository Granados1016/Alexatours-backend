import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destino } from './entities/destino.entity';
import { CreateDestinoDto } from './dto/create-destino.dto';

@Injectable()
export class DestinosService {
  constructor(
    @InjectRepository(Destino)
    private readonly destinoRepo: Repository<Destino>,
  ) {}

  findAll() {
    return this.destinoRepo.find({ where: { activo: true }, order: { nombre: 'ASC' } });
  }

  async findOne(id: number) {
    const destino = await this.destinoRepo.findOne({ where: { id }, relations: ['paquetes'] });
    if (!destino) throw new NotFoundException(`Destino #${id} no encontrado`);
    return destino;
  }

  create(dto: CreateDestinoDto) {
    const destino = this.destinoRepo.create(dto);
    return this.destinoRepo.save(destino);
  }

  async update(id: number, dto: Partial<CreateDestinoDto>) {
    await this.findOne(id);
    await this.destinoRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.destinoRepo.update(id, { activo: false });
    return { message: `Destino #${id} desactivado` };
  }
}
