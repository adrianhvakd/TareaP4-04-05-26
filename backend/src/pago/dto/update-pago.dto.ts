import { PartialType } from '@nestjs/mapped-types';
import { CreatePagoDto } from './create-pago.dto';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { MetodoPagoType } from '../entities/pago.entity';

export class UpdatePagoDto extends PartialType(CreatePagoDto) {
  @IsOptional()
  tramiteId?: string;

  @IsOptional()
  @IsNumber()
  montoPagado?: number;

  @IsOptional()
  @IsEnum(MetodoPagoType)
  metodoPago?: MetodoPagoType;

  @IsOptional()
  comprobante?: string;
}
