import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ContactoService } from './contacto.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Contacto')
@Controller()
export class ContactoController {
  constructor(private readonly service: ContactoService) {}

  // Rutas públicas
  @Post('contacto')
  @ApiOperation({ summary: 'Enviar mensaje de contacto (público)' })
  create(@Body() dto: CreateMensajeDto) {
    return this.service.create(dto);
  }

  // Rutas admin
  @Get('admin/contacto')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar mensajes de contacto (admin)' })
  findAll() {
    return this.service.findAll();
  }

  @Put('admin/contacto/:id/leido')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar mensaje como leído (admin)' })
  marcarLeido(@Param('id', ParseIntPipe) id: number) {
    return this.service.marcarLeido(id);
  }

  @Delete('admin/contacto/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar mensaje de contacto (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
