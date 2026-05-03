import { EmpresaEntity } from 'src/empresa/entities/empresa.entity';
import { PagoEntity } from 'src/pago/entities/pago.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 } from 'uuid';

export enum EstadoType {
  EN_PROCESO = 'En proceso',
  TERMINADO = 'Terminado',
  DECLARADO = 'Declarado',
  PARA_COBRO = 'Para cobro',
  COBRADO = 'Cobrado',
  ARCHIVO = 'Archivo',
  INACTIVO = 'Inactivo',
}

@Entity('tramite')
export class TramiteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = v4();

  @Column({ name: 'usuario_id', type: 'uuid', nullable: true })
  usuarioId?: string;

  @Column({ name: 'empresa_id', type: 'uuid', nullable: true })
  empresaId?: string;

  @ManyToOne(() => EmpresaEntity, (empresa) => empresa.tramites)
  @JoinColumn({ name: 'empresa_id' })
  empresa?: EmpresaEntity;

  @OneToMany(() => PagoEntity, (pago) => pago.tramite)
  pagos?: PagoEntity[];

  @Column({ type: 'enum', enum: EstadoType })
  estado?: EstadoType;

  @CreateDateColumn()
  fechaCreacion?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto?: number;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
