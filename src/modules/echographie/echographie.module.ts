import { Module } from '@nestjs/common';
import { EchographieService } from './echographies.service'; 
import { EchographieController } from './echographie.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Echographie, EchographieSchema } from './echographie.model'; 

@Module({
  exports: [
    MongooseModule.forFeature([
      { name: Echographie.name, schema: EchographieSchema },
    ]),
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Echographie.name, schema: EchographieSchema }, 
    ]),
  ],
  controllers: [EchographieController],
  providers: [EchographieService],
})
export class EchographieModule {}