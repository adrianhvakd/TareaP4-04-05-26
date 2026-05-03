import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post()
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagoService.create(createPagoDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('tramiteId') tramiteId?: string,
  ) {
    return this.pagoService.findAll(page, limit, tramiteId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagoService.update(id, updatePagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagoService.remove(id);
  }
}
