import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDestinoDto {
  @ApiProperty({ example: 'Cancún' })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'México' })
  @IsString()
  @MaxLength(100)
  pais: string;

  @ApiPropertyOptional({ example: 'Playas de arena blanca y mar turquesa.' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: 'https://example.com/cancun.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imagenUrl?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
