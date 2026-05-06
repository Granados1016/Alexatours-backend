import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('testimonios')
export class Testimonio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100, nullable: true })
  origen: string;

  @Column({ type: 'text' })
  comentario: string;

  @Column({ type: 'tinyint', default: 5 })
  estrellas: number;

  @Column({ nullable: true })
  foto_url: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'int', default: 0 })
  orden: number;

  @CreateDateColumn()
  created_at: Date;
}
