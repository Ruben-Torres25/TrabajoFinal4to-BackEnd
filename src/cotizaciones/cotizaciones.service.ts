import { Injectable } from '@nestjs/common';


@Injectable()
export class CotizacionesService {
  create(createCotizacioneDto) {
    return 'This action adds a new cotizacione';
  }

  findAll() {
    return `This action returns all cotizaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cotizacione`;
  }

  update(id: number, updateCotizacioneDto) {
    return `This action updates a #${id} cotizacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} cotizacione`;
  }
}
