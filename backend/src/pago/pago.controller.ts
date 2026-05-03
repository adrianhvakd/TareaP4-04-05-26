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
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from 'src/usuario/entities/usuario.entity';

@Controller('pago')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post()
  @Roles(UserType.USER)
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagoService.create(createPagoDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('tramiteId') tramiteId?: string,
    @Request() req?: any,
  ) {
    const isAdmin = req?.user?.role === UserType.ADMIN;
    if (!isAdmin) {
      return this.pagoService.findAllByUser(page, limit, req.user.id);
    }
    return this.pagoService.findAll(page, limit, tramiteId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagoService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserType.ADMIN)
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagoService.update(id, updatePagoDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.USER)
  remove(@Param('id') id: string, @Request() req: any) {
    const isAdmin = req.user.role === UserType.ADMIN;
    const usuarioId = isAdmin ? undefined : req.user.id;
    return this.pagoService.remove(id, usuarioId);
  }
}
