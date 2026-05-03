import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateEmpresaDto {
  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @IsNotEmpty()
  nombre?: string;

  @IsNotEmpty()
  direccion?: string;

  @IsNotEmpty()
  telefono?: string;
}
