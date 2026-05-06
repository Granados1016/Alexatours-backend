import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('articulos')
export class Articulo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  titulo: string;

  @Column({ unique: true, length: 220 })
  slug: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column({ type: 'text', nullable: true })
  resumen: string;

  @Column({ nullable: true })
  imagen_portada: string;

  @Column({ length: 100, nullable: true })
  categoria: string;

  @Column({ length: 160, nullable: true })
  meta_descripcion: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ default: false })
  publicado: boolean;

  @Column({ nullable: true })
  publicado_en: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
