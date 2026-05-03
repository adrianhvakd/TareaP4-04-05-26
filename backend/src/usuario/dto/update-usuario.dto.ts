import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserType } from '../entities/usuario.entity';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  password?: string;

  @IsEnum(UserType)
  @IsOptional()
  role?: UserType;
}
