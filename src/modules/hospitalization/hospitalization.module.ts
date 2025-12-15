import { Module } from '@nestjs/common';
import { Medecine, MedecinSchema } from '../pharmacy/pharmacy.model';
import { HospitalizationService } from './hospitalization.service';
import { HospitalizationController } from './hospitalization.controller';
import { SoldMedicineModel,SoldMedecinSchema } from '../pharmacy/soldMedicine';
import { MongooseModule } from '@nestjs/mongoose';

import {
  DailyHospitalizationRecordModel,
  DailyHospitalizationRecordSchema,
} from './dailyRecord.model';

import {
  HospitalizationPayementModel,
  HospitalizationPayementRecordSchema,
} from './hospitalizationPayment.model';

import {
  HospitalizationRecordModel,
  HospitalizationRecordSchema,
} from './hospitalization.model';

import {
  RecommandationSchema,
  RecommandationModel,
} from './recommandation.modal';

import { Patient, PatientSchema } from '../patients/patient.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Medecine.name, schema: MedecinSchema },
      {
        name: HospitalizationRecordModel.name,
        schema: HospitalizationRecordSchema,
      },

      {
        name: DailyHospitalizationRecordModel.name,
        schema: DailyHospitalizationRecordSchema,
      },

      {
        name: HospitalizationPayementModel.name,
        schema: HospitalizationPayementRecordSchema,
      },

      {
        name: RecommandationModel.name,
        schema: RecommandationSchema,
      },
      {
        name: SoldMedicineModel.name,
        schema: SoldMedecinSchema,
      },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      {
        name: HospitalizationRecordModel.name,
        schema: HospitalizationRecordSchema,
      },

      {
        name: DailyHospitalizationRecordModel.name,
        schema: DailyHospitalizationRecordSchema,
      },
    ]),
  ],
  providers: [HospitalizationService],
  controllers: [HospitalizationController],
})
export class HospitalizationModule {}
