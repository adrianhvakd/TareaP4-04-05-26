import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from 'src/usuario/entities/usuario.entity';

@Controller('empresa')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post()
  @Roles(UserType.USER)
  create(@Body() createEmpresaDto: CreateEmpresaDto, @Request() req: any) {
    createEmpresaDto.usuarioId = req.user.id;
    return this.empresaService.create(createEmpresaDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('nombre') nombre?: string,
    @Request() req?: any,
  ) {
    const isAdmin = req?.user?.role === UserType.ADMIN;
    const usuarioId = isAdmin ? undefined : req?.user?.id;
    return this.empresaService.findAll(page, limit, nombre, usuarioId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empresaService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserType.USER)
  update(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresaService.update(id, updateEmpresaDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.USER)
  remove(@Param('id') id: string, @Request() req: any) {
    const isAdmin = req.user.role === UserType.ADMIN;
    const usuarioId = isAdmin ? undefined : req.user.id;
    return this.empresaService.remove(id, usuarioId);
  }
}