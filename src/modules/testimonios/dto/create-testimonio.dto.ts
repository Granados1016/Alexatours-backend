import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTestimonioDto {
  @ApiProperty({ example: 'María González' })
  nombre: string;

  @ApiPropertyOptional({ example: 'Ciudad de México, México' })
  origen?: string;

  @ApiProperty({ example: 'Excelente servicio, el viaje superó todas mis expectativas.' })
  comentario: string;

  @ApiPropertyOptional({ example: 5 })
  estrellas?: number;

  @ApiPropertyOptional({ example: 'https://example.com/foto.jpg' })
  foto_url?: string;

  @ApiPropertyOptional({ default: true })
  activo?: boolean;

  @ApiPropertyOptional({ default: 0 })
  orden?: number;
}
