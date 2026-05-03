import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioEntity } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const password: string = createUsuarioDto.password ?? '';
    const saltos: number = parseInt(process.env.ENCRYPTION_SALT ?? '');
    const hash = await bcrypt.hash(password, saltos);
    createUsuarioDto.password = hash;
    const result = this.usuarioRepository.create(createUsuarioDto);
    const saved = this.usuarioRepository.save(result);
    return saved;
  }

  async findAll(page = 1, limit = 10, username?: string) {
    const [data, total] = await this.usuarioRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      where: {
        deletedAt: IsNull(),
        username: username ? Like(`%${username}%`) : undefined,
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
    const result = await this.usuarioRepository.findOne({
      where: { deletedAt: IsNull(), id: id },
    });
    return result;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    if (updateUsuarioDto.password) {
      const password: string = updateUsuarioDto.password ?? '';
      const saltos: number = parseInt(process.env.ENCRYPTION_SALT ?? '');
      const hash = await bcrypt.hash(password, saltos);
      updateUsuarioDto.password = hash;
    }
    const result = await this.usuarioRepository.update(id, updateUsuarioDto);
    return result;
  }

  async remove(id: string) {
    return await this.usuarioRepository.softDelete(id);
  }

  async findOneByUsername(username: string): Promise<UsuarioEntity | null> {
    const usuario = await this.usuarioRepository.findOneBy({ username });
    return usuario;
  }
}
