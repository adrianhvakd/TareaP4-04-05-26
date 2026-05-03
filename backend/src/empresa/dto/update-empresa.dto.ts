import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpresaDto } from './create-empresa.dto';
import { IsOptional } from 'class-validator';

export class UpdateEmpresaDto extends PartialType(CreateEmpresaDto) {
  @IsOptional()
  nombre?: string;

  @IsOptional()
  direccion?: string;

  @IsOptional()
  telefono?: string;
}
