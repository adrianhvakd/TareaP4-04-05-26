import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { EmpresaModule } from './empresa/empresa.module';
import { TramiteModule } from './tramite/tramite.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfigDB } from './config/config.database';
import { PagoModule } from './pago/pago.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: () => getConfigDB() }),
    AuthModule,
    UsuarioModule,
    EmpresaModule,
    TramiteModule,
    PagoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
