import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { MetodoPagoType } from '../entities/pago.entity';

export class CreatePagoDto {
  @IsNotEmpty()
  tramiteId?: string;

  @IsNotEmpty()
  @IsNumber()
  montoPagado?: number;

  @IsNotEmpty()
  @IsEnum(MetodoPagoType)
  metodoPago?: MetodoPagoType;

  @IsNotEmpty()
  comprobante?: string;
}
