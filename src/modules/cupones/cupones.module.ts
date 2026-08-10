import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cupon } from './cupon.entity';
import { CuponesController } from './cupones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cupon])],
  controllers: [CuponesController],
})
export class CuponesModule {}
