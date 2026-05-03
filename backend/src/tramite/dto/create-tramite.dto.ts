import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { EstadoType } from '../entities/tramite.entity';

export class CreateTramiteDto {
  @IsNotEmpty()
  empresaId?: string;

  @IsEnum(EstadoType)
  estado?: EstadoType;

  @IsNumber()
  @IsNotEmpty()
  monto?: number;
}
