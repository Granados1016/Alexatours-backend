import {
  Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cupon } from './cupon.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Cupones')
@Controller()
export class CuponesController {
  constructor(@InjectRepository(Cupon) private readonly repo: Repository<Cupon>) {}

  /** Validar cupón (público — lo usa el formulario de reserva) */
  @Post('cupones/validar')
  async validar(@Body('codigo') codigo: string) {
    if (!codigo) return { valido: false, mensaje: 'Código vacío' };
    const cupon = await this.repo.findOne({ where: { codigo: codigo.toUpperCase().trim(), activo: true } });
    if (!cupon) return { valido: false, mensaje: 'Cupón no válido o expirado' };

    const hoy = new Date().toISOString().split('T')[0];
    if (cupon.expiraEn && cupon.expiraEn < hoy) return { valido: false, mensaje: 'Cupón expirado' };
    if (cupon.maxUsos && cupon.usosActuales >= cupon.maxUsos) return { valido: false, mensaje: 'Cupón agotado' };

    return {
      valido: true,
      tipo: cupon.tipo,
      valor: cupon.valor,
      mensaje: cupon.tipo === 'porcentaje' ? `${cupon.valor}% de descuento` : `$${cupon.valor} de descuento`,
    };
  }

  /** Admin CRUD */
  @Get('admin/cupones')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll() { return this.repo.find({ order: { createdAt: 'DESC' } }); }

  @Post('admin/cupones')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() body: Partial<Cupon>) {
    if (body.codigo) body.codigo = body.codigo.toUpperCase().trim();
    const c = this.repo.create(body);
    return this.repo.save(c);
  }

  @Put('admin/cupones/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<Cupon>) {
    if (body.codigo) body.codigo = body.codigo.toUpperCase().trim();
    await this.repo.update(id, body);
    return this.repo.findOne({ where: { id } });
  }

  @Delete('admin/cupones/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.repo.delete(id);
    return { message: 'Cupón eliminado' };
  }
}
