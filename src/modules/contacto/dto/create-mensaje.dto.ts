import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMensajeDto {
  @ApiProperty({ example: 'Juan Pérez' })
  nombre: string;

  @ApiProperty({ example: 'juan@example.com' })
  email: string;

  @ApiPropertyOptional({ example: '+52 55 1234 5678' })
  telefono?: string;

  @ApiPropertyOptional({ example: 'Consulta sobre paquete a Cancún' })
  asunto?: string;

  @ApiProperty({ example: 'Me gustaría recibir información sobre los paquetes disponibles.' })
  mensaje: string;
}
