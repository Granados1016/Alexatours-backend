import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Destino } from '../../destinos/entities/destino.entity';

@Entity('paquetes')
export class Paquete {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ name: 'duracion_dias', unsigned: true })
  duracionDias: number;

  @Column({ type: 'text', nullable: true, comment: 'Lista separada por comas de qué incluye' })
  incluye: string;

  @Column({ name: 'imagen_url', length: 500, nullable: true })
  imagenUrl: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ default: false })
  destacado: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Destino, (destino) => destino.paquetes, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'destino_id' })
  destino: Destino;
}
