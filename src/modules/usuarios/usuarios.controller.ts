import {
  Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe,
  UseGuards, NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario, RolUsuario } from './entities/usuario.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Admin - Usuarios')
@Controller('admin/usuarios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsuariosController {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  @Get()
  async findAll() {
    const usuarios = await this.repo.find({ order: { createdAt: 'DESC' } });
    return usuarios.map(({ passwordHash, ...u }) => u);
  }

  @Post()
  async create(@Body() body: { nombre: string; email: string; password: string; rol?: RolUsuario }) {
    const existe = await this.repo.findOne({ where: { email: body.email } });
    if (existe) throw new NotFoundException('Ya existe un usuario con ese email');
    const hash = await bcrypt.hash(body.password, 10);
    const user = this.repo.create({
      nombre: body.nombre,
      email: body.email,
      passwordHash: hash,
      rol: body.rol ?? RolUsuario.STAFF,
    });
    const saved = await this.repo.save(user);
    const { passwordHash, ...result } = saved;
    return result;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { nombre?: string; email?: string; password?: string; rol?: RolUsuario; activo?: boolean },
  ) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario #${id} no encontrado`);

    if (body.nombre !== undefined) user.nombre = body.nombre;
    if (body.email !== undefined) user.email = body.email;
    if (body.rol !== undefined) user.rol = body.rol;
    if (body.activo !== undefined) user.activo = body.activo;
    if (body.password) user.passwordHash = await bcrypt.hash(body.password, 10);

    const saved = await this.repo.save(user);
    const { passwordHash, ...result } = saved;
    return result;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario #${id} no encontrado`);
    await this.repo.delete(id);
    return { message: `Usuario #${id} eliminado` };
  }
}
