import { TramiteEntity } from 'src/tramite/entities/tramite.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 } from 'uuid';

export enum MetodoPagoType {
  QR = 'QR',
  EFECTIVO = 'Efectivo',
}

@Entity('pago')
export class PagoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = v4();

  @Column({ name: 'tramite_id', type: 'uuid', nullable: true })
  tramiteId?: string;

  @ManyToOne(() => TramiteEntity, (tramite) => tramite.pagos)
  @JoinColumn({ name: 'tramite_id' })
  tramite?: TramiteEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montoPagado?: number;

  @Column({ type: 'enum', enum: MetodoPagoType })
  metodoPago?: MetodoPagoType;

  @Column({ type: 'text' })
  comprobante?: string;

  @CreateDateColumn()
  fechaPago?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deteledAt?: Date;
}
