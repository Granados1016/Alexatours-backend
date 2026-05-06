import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articulo } from './entities/articulo.entity';
import { CreateArticuloDto } from './dto/create-articulo.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Articulo)
    private readonly repo: Repository<Articulo>,
  ) {}

  private generarSlug(titulo: string): string {
    return titulo
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async findAll(soloPublicados = false): Promise<{ data: Articulo[]; total: number }> {
    const where = soloPublicados ? { publicado: true } : {};
    const [data, total] = await this.repo.findAndCount({
      where,
      order: { created_at: 'DESC' },
    });
    return { data, total };
  }

  async findAllPaginado(
    soloPublicados = false,
    page = 1,
    limit = 10,
  ): Promise<{ data: Articulo[]; total: number; page: number; limit: number }> {
    const where = soloPublicados ? { publicado: true } : {};
    const [data, total] = await this.repo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findBySlug(slug: string): Promise<Articulo> {
    const articulo = await this.repo.findOne({ where: { slug, publicado: true } });
    if (!articulo) {
      throw new NotFoundException(`Artículo con slug "${slug}" no encontrado`);
    }
    return articulo;
  }

  async findOne(id: number): Promise<Articulo> {
    const articulo = await this.repo.findOne({ where: { id } });
    if (!articulo) {
      throw new NotFoundException(`Artículo con id ${id} no encontrado`);
    }
    return articulo;
  }

  async create(dto: CreateArticuloDto): Promise<Articulo> {
    const slug = dto.slug ? dto.slug : this.generarSlug(dto.titulo);
    const articulo = this.repo.create({
      ...dto,
      slug,
      publicado_en: dto.publicado ? new Date() : undefined,
    });
    return this.repo.save(articulo);
  }

  async update(id: number, dto: Partial<CreateArticuloDto>): Promise<Articulo> {
    const articulo = await this.findOne(id);

    if (dto.slug === undefined && dto.titulo && dto.titulo !== articulo.titulo) {
      dto = { ...dto, slug: this.generarSlug(dto.titulo) };
    }

    if (dto.publicado === true && !articulo.publicado_en) {
      Object.assign(articulo, dto, { publicado_en: new Date() });
    } else {
      Object.assign(articulo, dto);
    }

    return this.repo.save(articulo);
  }

  async remove(id: number): Promise<{ message: string }> {
    const articulo = await this.findOne(id);
    await this.repo.remove(articulo);
    return { message: `Artículo ${id} eliminado correctamente` };
  }
}
