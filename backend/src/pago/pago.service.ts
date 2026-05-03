import { Injectable } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PagoEntity } from './entities/pago.entity';
import { TramiteEntity, EstadoType } from 'src/tramite/entities/tramite.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class PagoService {
  constructor(
    @InjectRepository(PagoEntity)
    private readonly pagoRepository: Repository<PagoEntity>,
    @InjectRepository(TramiteEntity)
    private readonly tramiteRepository: Repository<TramiteEntity>,
  ) {}

  async create(createPagoDto: CreatePagoDto) {
    const result = this.pagoRepository.create(createPagoDto);
    const saved = await this.pagoRepository.save(result);

    if (createPagoDto.tramiteId) {
      await this.checkAndUpdateTramiteEstado(createPagoDto.tramiteId);
    }

    return saved;
  }

  private async checkAndUpdateTramiteEstado(tramiteId: string) {
    const tramite = await this.tramiteRepository.findOne({
      where: { id: tramiteId, deletedAt: IsNull() },
      relations: ['pagos'],
    });

    if (!tramite || !tramite.monto) return;

    if (tramite.estado === EstadoType.COBRADO) return;

    const totalPagado = tramite.pagos
      ?.filter(p => p.deteledAt === null)
      .reduce((sum, p) => sum + Number(p.montoPagado), 0) || 0;

    if (totalPagado >= Number(tramite.monto)) {
      await this.tramiteRepository.update(tramiteId, { estado: EstadoType.COBRADO });
    }
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
      relations: ['tramite', 'tramite.empresa'],
    });
    return {
      data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findAllByUser(page = 1, limit = 10, usuarioId: string) {
    const [data, total] = await this.pagoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { fechaPago: 'DESC' },
      where: {
        deteledAt: IsNull(),
      },
      relations: ['tramite', 'tramite.empresa'],
    });
    
    const filteredData = data.filter(pago => 
      pago.tramite?.empresa?.usuarioId === usuarioId
    );
    
    return {
      data: filteredData,
      total: filteredData.length,
      page,
      limit,
      lastPage: Math.ceil(filteredData.length / limit),
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

  async remove(id: string, usuarioId?: string) {
    if (usuarioId) {
      const pago = await this.pagoRepository.findOne({
        where: { id, deteledAt: IsNull() },
        relations: ['tramite', 'tramite.empresa'],
      });
      if (!pago || pago.tramite?.empresa?.usuarioId !== usuarioId) {
        return { affected: 0 };
      }
    }
    const result = await this.pagoRepository.softDelete(id);
    return result;
  }
}
