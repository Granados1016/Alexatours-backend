import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// ── Endpoints públicos ──────────────────────────────────────────────────────
@ApiTags('Reservas')
@Controller('reservas')
export class ReservasPublicController {
  constructor(private readonly service: ReservasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear reserva online (público)' })
  create(@Body() dto: CreateReservaDto) {
    return this.service.create(dto);
  }
}

// ── Endpoints admin ─────────────────────────────────────────────────────────
@ApiTags('Admin — Reservas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/reservas')
export class ReservasAdminController {
  constructor(private readonly service: ReservasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las reservas (admin)' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver una reserva (admin)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar estado / precio (admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservaDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar reserva (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
