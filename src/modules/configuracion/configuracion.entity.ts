import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('configuracion')
export class Configuracion {
  @PrimaryColumn({ length: 100 })
  clave: string;

  @Column({ type: 'text', nullable: true })
  valor: string;

  @Column({ length: 50, nullable: true })
  grupo: string;

  @Column({ length: 150, nullable: true })
  etiqueta: string;

  @Column({
    type: 'enum',
    enum: ['text', 'textarea', 'url', 'tel', 'email', 'color', 'image'],
    default: 'text',
  })
  tipo: 'text' | 'textarea' | 'url' | 'tel' | 'email' | 'color' | 'image';

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
