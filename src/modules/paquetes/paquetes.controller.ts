import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaquetesService } from './paquetes.service';
import { CreatePaqueteDto } from './dto/create-paquete.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Paquetes')
@Controller('paquetes')
export class PaquetesController {
  constructor(private readonly service: PaquetesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los paquetes activos (público)' })
  findAll() {
    return this.service.findAll();
  }

  @Get('destacados')
  @ApiOperation({ summary: 'Listar paquetes destacados (público)' })
  findDestacados() {
    return this.service.findDestacados();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener paquete por ID (público)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear paquete (admin)' })
  create(@Body() dto: CreatePaqueteDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar paquete (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreatePaqueteDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desactivar paquete (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
