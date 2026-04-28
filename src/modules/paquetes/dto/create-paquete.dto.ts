import { IsString, IsOptional, IsNumber, IsBoolean, IsPositive, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePaqueteDto {
  @ApiProperty({ example: 'Cancún Todo Incluido' })
  @IsString()
  @MaxLength(150)
  nombre: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 18500.00 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  precio: number;

  @ApiProperty({ example: 7 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  duracionDias: number;

  @ApiPropertyOptional({ example: 'Vuelo redondo,Hotel 5 estrellas,Traslados' })
  @IsOptional()
  @IsString()
  incluye?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imagenUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  destinoId?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  destacado?: boolean;
}
