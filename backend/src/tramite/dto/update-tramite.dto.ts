import { PartialType } from '@nestjs/mapped-types';
import { CreateTramiteDto } from './create-tramite.dto';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { EstadoType } from '../entities/tramite.entity';

export class UpdateTramiteDto extends PartialType(CreateTramiteDto) {
  @IsOptional()
  empresaId?: string;

  @IsOptional()
  @IsEnum(EstadoType)
  estado?: EstadoType;

  @IsOptional()
  @IsNumber()
  monto?: number;
}
