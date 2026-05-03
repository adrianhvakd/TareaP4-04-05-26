import { Injectable } from '@nestjs/common';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TramiteEntity } from './entities/tramite.entity';
import { IsNull, Repository } from 'typeorm';
import { PagoEntity } from 'src/pago/entities/pago.entity';

@Injectable()
export class TramiteService {
  constructor(
    @InjectRepository(TramiteEntity)
    private readonly tramiteRepository: Repository<TramiteEntity>,
    @InjectRepository(PagoEntity)
    private readonly pagoRepository: Repository<PagoEntity>,
  ) {}

  async create(createTramiteDto: CreateTramiteDto) {
    const result = this.tramiteRepository.create(createTramiteDto);
    const saved = await this.tramiteRepository.save(result);
    return saved;
  }

  async findAll(page = 1, limit = 10, fecha?: Date, usuarioId?: string) {
    const where: any = { deletedAt: IsNull() };
    
    if (fecha) {
      where.fechaCreacion = fecha;
    }
    
    if (usuarioId) {
      where.usuarioId = usuarioId;
    }

    const [data, total] = await this.tramiteRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { fechaCreacion: 'DESC' },
      where,
      relations: ['empresa'],
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

  async remove(id: string, usuarioId?: string) {
    if (usuarioId) {
      const tramite = await this.tramiteRepository.findOne({
        where: { id, usuarioId, deletedAt: IsNull() },
      });
      if (!tramite) {
        return { affected: 0 };
      }
    }

    await this.pagoRepository.softDelete({ tramiteId: id, deteledAt: IsNull() });

    const result = await this.tramiteRepository.softDelete(id);
    return result;
  }
}
