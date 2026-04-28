import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reserva } from '../../reservas/entities/reserva.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 30, nullable: true })
  telefono: string;

  @Column({ length: 100, nullable: true })
  ciudad: string;

  @Column({ type: 'text', nullable: true })
  mensaje: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Reserva, (reserva) => reserva.cliente)
  reservas: Reserva[];
}
