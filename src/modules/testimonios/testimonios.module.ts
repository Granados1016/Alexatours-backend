import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimonio } from './entities/testimonio.entity';
import { TestimoniosService } from './testimonios.service';
import { TestimoniosController } from './testimonios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Testimonio])],
  controllers: [TestimoniosController],
  providers: [TestimoniosService],
  exports: [TestimoniosService],
})
export class TestimoniosModule {}
