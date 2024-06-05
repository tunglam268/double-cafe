import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from '../../core/base/base.service';
import { FilterDTO } from '../../dto/user.dto';
import { PageDto, PageOptionsDto } from '../../dto/pagination.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    public repository: Repository<User>,
  ) {
    super(repository);
  }

  async Pagination(
    filter: FilterDTO,
    pagination: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return this.pagination(this.repository, filter, pagination, 'users');
  }
}
