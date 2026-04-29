import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfiguracionService } from './configuracion.service';

@ApiTags('configuracion')
@Controller()
export class ConfiguracionController {
  constructor(private readonly service: ConfiguracionService) {}

  /** Public: flat key→value map for the frontend landing page */
  @Get('configuracion')
  @ApiOperation({ summary: 'Get all site settings as key-value map' })
  getPublic(): Promise<Record<string, string>> {
    return this.service.getMap();
  }

  /** Protected: full rows list for the admin panel */
  @Get('admin/configuracion')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all settings with metadata (admin)' })
  getAdmin() {
    return this.service.findAll();
  }

  /** Protected: bulk update values */
  @Put('admin/configuracion')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk update site settings (admin)' })
  async update(@Body() body: Record<string, string>): Promise<{ ok: boolean }> {
    await this.service.bulkUpdate(body);
    return { ok: true };
  }
}
