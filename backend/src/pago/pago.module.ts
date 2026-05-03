import { Module } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoEntity } from './entities/pago.entity';
import { TramiteEntity } from 'src/tramite/entities/tramite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PagoEntity, TramiteEntity])],
  controllers: [PagoController],
  providers: [PagoService],
})
export class PagoModule {}
