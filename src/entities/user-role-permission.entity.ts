import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { BaseEntity } from './base.entity';

@Entity('user_role_permissions')
export class UserRolePermission extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_uuid' })
  role: Role;

  @ManyToOne(() => Permission)
  @JoinColumn({ name: 'permission_uuid' })
  permission: Permission;
}
