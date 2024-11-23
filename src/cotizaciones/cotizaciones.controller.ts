import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';


@Controller('cotizaciones')
export class CotizacionesController {
  constructor(private readonly cotizacionesService) {}

  @Post()
  create(@Body() createCotizacioneDto) {
    return this.cotizacionesService.create(createCotizacioneDto);
  }

  @Get()
  findAll() {
    return this.cotizacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cotizacionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCotizacioneDto) {
    return this.cotizacionesService.update(+id, updateCotizacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cotizacionesService.remove(+id);
  }
}
