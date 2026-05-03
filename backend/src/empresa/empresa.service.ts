import { Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Repository } from 'typeorm';
import { EmpresaEntity } from './entities/empresa.entity';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(EmpresaEntity)
    private readonly empresaRepository: Repository<EmpresaEntity>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto) {
    const result = this.empresaRepository.create(createEmpresaDto);
    const saved = this.empresaRepository.save(result);
    return saved;
  }

  async findAll(page = 1, limit = 10, nombre?: string) {
    const [data, total] = await this.empresaRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      where: {
        deletedAt: IsNull(),
        nombre: nombre ? Like(`%${nombre}%`) : undefined,
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
    const result = await this.empresaRepository.findOne({
      where: { deletedAt: IsNull(), id: id },
    });
    return result;
  }

  async update(id: string, updateEmpresaDto: UpdateEmpresaDto) {
    const result = await this.empresaRepository.update(id, updateEmpresaDto);
    return result;
  }

  async remove(id: string) {
    const result = await this.empresaRepository.softDelete(id);
    return result;
  }
}
