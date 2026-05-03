import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 } from 'uuid';

export enum UserType {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = v4();

  @Column({ unique: true })
  username?: string;

  @Column()
  email?: string;

  @Column()
  password?: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.USER })
  role?: UserType;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
