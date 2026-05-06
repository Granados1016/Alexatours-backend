import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReservaDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '9811234567' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  paqueteId: number;

  @ApiPropertyOptional({ example: 'Cancún Todo Incluido' })
  @IsOptional()
  @IsString()
  paqueteNombre?: string;

  @ApiProperty({ example: '2025-06-15' })
  @IsString()
  @IsNotEmpty()
  fechaViaje: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @Max(20)
  numPersonas: number;

  @ApiPropertyOptional({ example: 'Preferimos habitación con vista al mar.' })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiPropertyOptional({ example: 9800 })
  @IsOptional()
  precioTotal?: number;
}
