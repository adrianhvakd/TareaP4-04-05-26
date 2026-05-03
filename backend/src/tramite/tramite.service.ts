import { Injectable } from '@nestjs/common';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TramiteEntity } from './entities/tramite.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class TramiteService {
  constructor(
    @InjectRepository(TramiteEntity)
    private readonly tramiteRepository: Repository<TramiteEntity>,
  ) {}

  async create(createTramiteDto: CreateTramiteDto) {
    const result = this.tramiteRepository.create(createTramiteDto);
    const saved = await this.tramiteRepository.save(result);
    return saved;
  }

  async findAll(page = 1, limit = 10, fecha?: Date) {
    const [data, total] = await this.tramiteRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { fechaCreacion: 'DESC' },
      where: {
        deletedAt: IsNull(),
        fechaCreacion: fecha ? fecha : new Date(),
      },
    });
    return {
      data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const result = await this.tramiteRepository.findOne({
      where: { deletedAt: IsNull(), id: id },
    });
    return result;
  }

  async update(id: string, updateTramiteDto: UpdateTramiteDto) {
    const result = await this.tramiteRepository.update(id, updateTramiteDto);
    return result;
  }

  async remove(id: string) {
    const result = await this.tramiteRepository.softDelete(id);
    return result;
  }
}
