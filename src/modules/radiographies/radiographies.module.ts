import { Module } from '@nestjs/common';
import { RadiographieService } from './radiographies.service';
import { RadiographieController } from './radiographies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Radiographie, RadiographieSchema } from './radiographie.model';

@Module({
  exports: [
    MongooseModule.forFeature([
      { name: Radiographie.name, schema: RadiographieSchema },
    ]),
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Radiographie.name, schema: RadiographieSchema },
    ]),
  ],
  controllers: [RadiographieController],
  providers: [RadiographieService],
})
export class RadiographiesModule {}
