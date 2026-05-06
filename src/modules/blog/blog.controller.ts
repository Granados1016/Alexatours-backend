import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// ─── Rutas públicas ───────────────────────────────────────────────────────────
@ApiTags('Blog (público)')
@Controller('blog')
export class BlogPublicController {
  constructor(private readonly service: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Listar artículos publicados (público)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.service.findAllPaginado(true, Number(page), Number(limit));
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Obtener artículo por slug (público)' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }
}

// ─── Rutas admin ──────────────────────────────────────────────────────────────
@ApiTags('Blog (admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/blog')
export class BlogAdminController {
  constructor(private readonly service: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los artículos (admin)' })
  findAll() {
    return this.service.findAll(false);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener artículo por ID (admin)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear artículo (admin)' })
  create(@Body() dto: CreateArticuloDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar artículo (admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateArticuloDto>,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar artículo (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
