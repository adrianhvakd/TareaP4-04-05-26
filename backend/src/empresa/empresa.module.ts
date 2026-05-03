import { Module } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaEntity } from './entities/empresa.entity';
import { TramiteEntity } from 'src/tramite/entities/tramite.entity';
import { PagoEntity } from 'src/pago/entities/pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaEntity, TramiteEntity, PagoEntity])],
  controllers: [EmpresaController],
  providers: [EmpresaService],
})
export class EmpresaModule {}
