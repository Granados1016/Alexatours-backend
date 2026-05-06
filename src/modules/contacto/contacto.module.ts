import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { ContactoService } from './contacto.service';
import { ContactoController } from './contacto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Mensaje])],
  controllers: [ContactoController],
  providers: [ContactoService],
  exports: [ContactoService],
})
export class ContactoModule {}
