import { Module } from '@nestjs/common';
import { IndiceService } from './indice.service';
import { IndiceController } from './indice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Indice } from './entities/indice.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Indice]), 
  ],
  controllers: [IndiceController], 
  providers: [IndiceService], 
  exports: [IndiceService], 
})
export class IndiceModule {}