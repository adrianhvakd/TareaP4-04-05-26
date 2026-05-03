import { Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Repository } from 'typeorm';
import { EmpresaEntity } from './entities/empresa.entity';
import { TramiteEntity } from 'src/tramite/entities/tramite.entity';
import { PagoEntity } from 'src/pago/entities/pago.entity';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(EmpresaEntity)
    private readonly empresaRepository: Repository<EmpresaEntity>,
    @InjectRepository(TramiteEntity)
    private readonly tramiteRepository: Repository<TramiteEntity>,
    @InjectRepository(PagoEntity)
    private readonly pagoRepository: Repository<PagoEntity>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto) {
    const result = this.empresaRepository.create(createEmpresaDto);
    const saved = this.empresaRepository.save(result);
    return saved;
  }

  async findAll(page = 1, limit = 10, nombre?: string, usuarioId?: string) {
    const where: any = { deletedAt: IsNull() };
    
    if (nombre) {
      where.nombre = Like(`%${nombre}%`);
    }
    
    if (usuarioId) {
      where.usuarioId = usuarioId;
    }

    const [data, total] = await this.empresaRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      where,
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
    const result = await this.empresaRepository.findOne({
      where: { deletedAt: IsNull(), id: id },
    });
    return result;
  }

  async update(id: string, updateEmpresaDto: UpdateEmpresaDto) {
    const result = await this.empresaRepository.update(id, updateEmpresaDto);
    return result;
  }

  async remove(id: string, usuarioId?: string) {
    if (usuarioId) {
      const empresa = await this.empresaRepository.findOne({
        where: { id, usuarioId, deletedAt: IsNull() },
      });
      if (!empresa) {
        return { affected: 0 };
      }
    }

    const tramites = await this.tramiteRepository.find({
      where: { empresaId: id, deletedAt: IsNull() },
      select: ['id'],
    });

    for (const tramite of tramites) {
      await this.pagoRepository.softDelete({ tramiteId: tramite.id, deteledAt: IsNull() });
    }

    await this.tramiteRepository.softDelete({ empresaId: id, deletedAt: IsNull() });

    const result = await this.empresaRepository.softDelete(id);
    return result;
  }
}