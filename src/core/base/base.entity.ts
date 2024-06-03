import {
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryColumn,
  DeleteDateColumn, PrimaryGeneratedColumn, Column
} from "typeorm";
import { Exclude } from 'class-transformer';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'id', type: 'int', generated: 'increment', unique: true })
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
