import { Module } from '@nestjs/common';
import { TramiteService } from './tramite.service';
import { TramiteController } from './tramite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TramiteEntity } from './entities/tramite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TramiteEntity])],
  controllers: [TramiteController],
  providers: [TramiteService],
})
export class TramiteModule {}
