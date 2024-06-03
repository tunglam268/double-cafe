import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../core/base/base.entity';
import { UserStatusEnum } from '../core/base/base.enum';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ name: 'username', unique: true })
  username: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'status', default: UserStatusEnum.ACTIVE })
  status: string;

  @Column({ name: 'mail' })
  mail: string;

  @Column({ name: 'phone' })
  phone: string;
}
