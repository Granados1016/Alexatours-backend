import {
  Controller, Post, Get, Delete, Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suscriptor } from './suscriptor.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Newsletter')
@Controller()
export class NewsletterController {
  constructor(
    @InjectRepository(Suscriptor)
    private readonly repo: Repository<Suscriptor>,
  ) {}

  @Post('newsletter')
  async suscribir(@Body('email') email: string) {
    if (!email || !email.includes('@')) {
      return { ok: false, message: 'Email inválido' };
    }
    const existe = await this.repo.findOne({ where: { email } });
    if (existe) return { ok: true, message: 'Ya estás suscrito' };
    const s = this.repo.create({ email });
    await this.repo.save(s);
    return { ok: true, message: '¡Suscrito exitosamente!' };
  }

  @Get('admin/newsletter')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  @Delete('admin/newsletter/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.repo.delete(id);
    return { message: `Suscriptor #${id} eliminado` };
  }
}
