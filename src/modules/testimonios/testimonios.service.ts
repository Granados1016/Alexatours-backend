import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonio } from './entities/testimonio.entity';
import { CreateTestimonioDto } from './dto/create-testimonio.dto';

@Injectable()
export class TestimoniosService {
  constructor(
    @InjectRepository(Testimonio)
    private readonly testimonioRepo: Repository<Testimonio>,
  ) {}

  findAll() {
    return this.testimonioRepo.find({
      where: { activo: true },
      order: { orden: 'ASC' },
    });
  }

  findAllAdmin() {
    return this.testimonioRepo.find({ order: { orden: 'ASC' } });
  }

  create(dto: CreateTestimonioDto) {
    const testimonio = this.testimonioRepo.create(dto);
    return this.testimonioRepo.save(testimonio);
  }

  async update(id: number, dto: Partial<CreateTestimonioDto>) {
    const testimonio = await this.testimonioRepo.findOne({ where: { id } });
    if (!testimonio) throw new NotFoundException(`Testimonio #${id} no encontrado`);
    await this.testimonioRepo.update(id, dto);
    return this.testimonioRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const testimonio = await this.testimonioRepo.findOne({ where: { id } });
    if (!testimonio) throw new NotFoundException(`Testimonio #${id} no encontrado`);
    await this.testimonioRepo.delete(id);
    return { message: `Testimonio #${id} eliminado` };
  }
}
