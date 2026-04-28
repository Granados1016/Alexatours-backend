import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@alexatours.mx' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'tu_password' })
  @IsString()
  @MinLength(6)
  password: string;
}
