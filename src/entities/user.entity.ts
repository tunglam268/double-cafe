import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../core/base/base.entity';
import { UserStatusEnum } from '../core/base/base.enum';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ name: 'username', unique: true, nullable: false })
  username: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'full_name', nullable: false })
  fullName: string;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({
    name: 'status',
    default: UserStatusEnum.ACTIVE,
  })
  status: string;

  @Column({ name: 'mail', nullable: false })
  mail: string;

  @Column({ name: 'phone', nullable: false })
  phone: string;
}
