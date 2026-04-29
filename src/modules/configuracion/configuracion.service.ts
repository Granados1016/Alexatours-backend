import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuracion } from './configuracion.entity';

@Injectable()
export class ConfiguracionService {
  constructor(
    @InjectRepository(Configuracion)
    private readonly repo: Repository<Configuracion>,
  ) {}

  /** Returns all settings grouped as { grupo: { clave: row } } */
  async findAll(): Promise<Configuracion[]> {
    return this.repo.find({ order: { grupo: 'ASC', clave: 'ASC' } });
  }

  /** Returns flat key→value map for public use */
  async getMap(): Promise<Record<string, string>> {
    const rows = await this.repo.find();
    return Object.fromEntries(rows.map((r) => [r.clave, r.valor ?? '']));
  }

  /** Bulk upsert: only updates `valor` for existing claves */
  async bulkUpdate(updates: Record<string, string>): Promise<void> {
    const entries = Object.entries(updates);
    if (!entries.length) return;

    await Promise.all(
      entries.map(([clave, valor]) =>
        this.repo.update({ clave }, { valor }),
      ),
    );
  }
}
