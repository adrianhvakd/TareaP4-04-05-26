import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { EstadoType } from '../entities/tramite.entity';

export class CreateTramiteDto {
  @IsNotEmpty()
  @IsUUID()
  empresaId?: string;

  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @IsOptional()
  @IsEnum(EstadoType)
  estado?: EstadoType;

  @IsNumber()
  @IsNotEmpty()
  monto?: number;
}
