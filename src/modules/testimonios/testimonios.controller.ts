import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TestimoniosService } from './testimonios.service';
import { CreateTestimonioDto } from './dto/create-testimonio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Testimonios')
@Controller()
export class TestimoniosController {
  constructor(private readonly service: TestimoniosService) {}

  // Rutas públicas
  @Get('testimonios')
  @ApiOperation({ summary: 'Listar testimonios activos (público)' })
  findAll() {
    return this.service.findAll();
  }

  // Rutas admin
  @Get('admin/testimonios')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos los testimonios (admin)' })
  findAllAdmin() {
    return this.service.findAllAdmin();
  }

  @Post('admin/testimonios')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear testimonio (admin)' })
  create(@Body() dto: CreateTestimonioDto) {
    return this.service.create(dto);
  }

  @Put('admin/testimonios/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar testimonio (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateTestimonioDto>) {
    return this.service.update(id, dto);
  }

  @Delete('admin/testimonios/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar testimonio (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
