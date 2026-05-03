import { Injectable } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PagoEntity } from './entities/pago.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class PagoService {
  constructor(
    @InjectRepository(PagoEntity)
    private readonly pagoRepository: Repository<PagoEntity>,
  ) {}

  async create(createPagoDto: CreatePagoDto) {
    const result = this.pagoRepository.create(createPagoDto);
    const saved = await this.pagoRepository.save(result);
    return saved;
  }

  async findAll(page = 1, limit = 10, tramiteId?: string) {
    const [data, total] = await this.pagoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { fechaPago: 'DESC' },
      where: {
        deteledAt: IsNull(),
        tramiteId: tramiteId ? tramiteId : undefined,
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
    const result = await this.pagoRepository.findOne({
      where: { deteledAt: IsNull(), id: id },
    });
    return result;
  }

  async update(id: string, updatePagoDto: UpdatePagoDto) {
    const result = await this.pagoRepository.update(id, updatePagoDto);
    return result;
  }

  async remove(id: string) {
    const reuslt = await this.pagoRepository.softDelete(id);
    return reuslt;
  }
}
