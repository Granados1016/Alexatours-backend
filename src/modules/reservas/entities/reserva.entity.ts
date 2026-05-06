import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EstadoReserva {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
}

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  // Datos del cliente
  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  // Datos del paquete
  @Column({ name: 'paquete_id' })
  paqueteId: number;

  @Column({ name: 'paquete_nombre', length: 200, nullable: true })
  paqueteNombre: string;

  // Detalles
  @Column({ name: 'fecha_viaje', type: 'date' })
  fechaViaje: string;

  @Column({ name: 'num_personas', type: 'int', default: 1 })
  numPersonas: number;

  @Column({ type: 'text', nullable: true })
  notas: string;

  // Estado
  @Column({ type: 'enum', enum: EstadoReserva, default: EstadoReserva.PENDIENTE })
  estado: EstadoReserva;

  @Column({ name: 'precio_total', type: 'decimal', precision: 10, scale: 2, nullable: true })
  precioTotal: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
