import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { Permission } from '../../entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService extends BaseService<Permission> {
  constructor(
    @InjectRepository(Permission)
    public repository: Repository<Permission>,
  ) {
    super(repository);
  }
}
