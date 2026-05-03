import { TramiteEntity } from 'src/tramite/entities/tramite.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 } from 'uuid';

@Entity('empresa')
export class EmpresaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = v4();

  @Column({ name: 'usuario_id', type: 'uuid', nullable: true })
  usuarioId?: string;

  @Column()
  nombre?: string;

  @OneToMany(() => TramiteEntity, (tramite) => tramite.empresa)
  tramites?: TramiteEntity[];

  @Column()
  direccion?: string;

  @Column()
  telefono?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
