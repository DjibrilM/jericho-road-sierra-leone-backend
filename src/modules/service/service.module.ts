import { Module } from '@nestjs/common';
import { HospitalServices } from './service.service';
import { ServiceController } from './service.controller';
import { Service, serviceSchema } from './service.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: serviceSchema }]),
  ],

  exports: [
    MongooseModule.forFeature([{ name: Service.name, schema: serviceSchema }]),
  ],

  controllers: [ServiceController],
  providers: [HospitalServices],
})
export class ServiceModule {}
