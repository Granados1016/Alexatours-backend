import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoReserva } from '../entities/reserva.entity';

export class UpdateReservaDto {
  @ApiPropertyOptional({ enum: EstadoReserva })
  @IsOptional()
  @IsEnum(EstadoReserva)
  estado?: EstadoReserva;

  @ApiPropertyOptional({ example: 9800 })
  @IsOptional()
  @IsNumber()
  precioTotal?: number;
}
