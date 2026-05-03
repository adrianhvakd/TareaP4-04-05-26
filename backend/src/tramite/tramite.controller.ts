import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TramiteService } from './tramite.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from 'src/usuario/entities/usuario.entity';

@Controller('tramite')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TramiteController {
  constructor(private readonly tramiteService: TramiteService) {}

  @Post()
  @Roles(UserType.USER)
  create(@Body() createTramiteDto: CreateTramiteDto, @Request() req: any) {
    createTramiteDto.usuarioId = req.user.id;
    return this.tramiteService.create(createTramiteDto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('fecha') fecha?: Date,
  ) {
    const isAdmin = req.user.role === UserType.ADMIN;
    const usuarioId = isAdmin ? undefined : req.user.id;
    return this.tramiteService.findAll(page, limit, fecha, usuarioId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tramiteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTramiteDto: UpdateTramiteDto) {
    return this.tramiteService.update(id, updateTramiteDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.USER)
  remove(@Param('id') id: string, @Request() req: any) {
    const isAdmin = req.user.role === UserType.ADMIN;
    const usuarioId = isAdmin ? undefined : req.user.id;
    return this.tramiteService.remove(id, usuarioId);
  }
}
