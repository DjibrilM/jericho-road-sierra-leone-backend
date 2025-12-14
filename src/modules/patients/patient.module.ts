import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient } from './patient.model';
import { PatientSchema } from './patient.model';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
  ],
})
export class PatientModule {}
