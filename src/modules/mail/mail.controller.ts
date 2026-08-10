import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MailService } from './mail.service';

@ApiTags('Admin — Correo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/correo')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('config')
  @ApiOperation({ summary: 'Obtener configuración SMTP (sin contraseña)' })
  getConfig() {
    return this.mailService.getSmtpConfig();
  }

  @Put('config')
  @ApiOperation({ summary: 'Guardar configuración SMTP' })
  async saveConfig(@Body() body: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass?: string;
    mailTo: string;
  }) {
    await this.mailService.saveSmtpConfig(body);
    return { ok: true };
  }

  @Post('test')
  @ApiOperation({ summary: 'Enviar correo de prueba' })
  async sendTest(@Body() body: { to: string }) {
    await this.mailService.enviarCorreoPrueba(body.to);
    return { ok: true };
  }
}
