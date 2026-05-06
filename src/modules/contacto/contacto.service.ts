import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { CreateMensajeDto } from './dto/create-mensaje.dto';

@Injectable()
export class ContactoService {
  constructor(
    @InjectRepository(Mensaje)
    private readonly mensajeRepo: Repository<Mensaje>,
  ) {}

  create(dto: CreateMensajeDto) {
    const mensaje = this.mensajeRepo.create(dto);
    return this.mensajeRepo.save(mensaje);
  }

  findAll() {
    return this.mensajeRepo.find({ order: { created_at: 'DESC' } });
  }

  async marcarLeido(id: number) {
    const mensaje = await this.mensajeRepo.findOne({ where: { id } });
    if (!mensaje) throw new NotFoundException(`Mensaje #${id} no encontrado`);
    await this.mensajeRepo.update(id, { leido: true });
    return this.mensajeRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const mensaje = await this.mensajeRepo.findOne({ where: { id } });
    if (!mensaje) throw new NotFoundException(`Mensaje #${id} no encontrado`);
    await this.mensajeRepo.delete(id);
    return { message: `Mensaje #${id} eliminado` };
  }
}
