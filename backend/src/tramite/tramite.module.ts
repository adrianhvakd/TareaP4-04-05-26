import { Module } from '@nestjs/common';
import { TramiteService } from './tramite.service';
import { TramiteController } from './tramite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TramiteEntity } from './entities/tramite.entity';
import { PagoEntity } from 'src/pago/entities/pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TramiteEntity, PagoEntity])],
  controllers: [TramiteController],
  providers: [TramiteService],
})
export class TramiteModule {}
