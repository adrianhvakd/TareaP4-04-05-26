import { IsNotEmpty } from 'class-validator';

export class CreateEmpresaDto {
  @IsNotEmpty()
  nombre?: string;

  @IsNotEmpty()
  direccion?: string;

  @IsNotEmpty()
  telefono?: string;
}
