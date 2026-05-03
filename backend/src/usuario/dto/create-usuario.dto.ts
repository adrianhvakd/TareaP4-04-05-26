import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserType } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsNotEmpty()
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsNotEmpty()
  password?: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  role?: UserType;
}
