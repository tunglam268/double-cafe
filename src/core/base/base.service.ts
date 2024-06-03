import { Injectable } from '@nestjs/common';
import {
  DeleteResult,
  FindManyOptions,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export abstract class BaseService<T extends ObjectLiteral> {
  constructor(public repository: Repository<T>) {}

  async findOne(query: any): Promise<T> {
    return this.repository.findOne(query);
  }

  async getOne(query: any): Promise<T> {
    return this.repository.findOne({ where: query });
  }

  async findOneBy(query: any): Promise<T> {
    return this.repository.findOneBy(query);
  }

  async updateById(id: string, data: any): Promise<UpdateResult> {
    return this.repository.update(id, data);
  }

  async update(condition: any, data: any): Promise<UpdateResult> {
    return this.repository.update({ ...condition }, data);
  }

  async create(data: any): Promise<T> {
    return this.repository.save(data);
  }

  async deleteById(id: string): Promise<DeleteResult> {
    return this.repository.softDelete(id);
  }

  async delete(condition: any): Promise<DeleteResult> {
    return this.repository.softDelete({ ...condition });
  }
}
