import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('cupones')
export class Cupon {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 50, unique: true })
  codigo: string;

  /** 'porcentaje' | 'fijo' */
  @Column({ length: 20, default: 'porcentaje' })
  tipo: string;

  /** Valor del descuento: 10 = 10% o $10 */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  /** Fecha de expiración (null = sin límite) */
  @Column({ name: 'expira_en', type: 'date', nullable: true })
  expiraEn: string;

  /** Máximo de usos (null = ilimitado) */
  @Column({ name: 'max_usos', type: 'int', nullable: true })
  maxUsos: number;

  @Column({ name: 'usos_actuales', default: 0 })
  usosActuales: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
