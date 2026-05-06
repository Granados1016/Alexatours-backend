import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('mensajes_contacto')
export class Mensaje {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 200, nullable: true })
  asunto: string;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ default: false })
  leido: boolean;

  @CreateDateColumn()
  created_at: Date;
}
