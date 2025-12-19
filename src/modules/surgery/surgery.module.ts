import { Module } from '@nestjs/common';
import { Medecine, MedecinSchema } from '../pharmacy/pharmacy.model';
import { HospitalizationController } from './surgery.controller';
import { SoldMedicineModel, SoldMedecinSchema } from '../pharmacy/soldMedicine';
import { MongooseModule } from '@nestjs/mongoose';

import {
  DailySurgeryRecordModel,
  DailySurgeryRecordSchema,
} from './dailyRecord.model';

import {
  SurgeryPaymentModel,
  SurgeryPaymentRecordSchema,
} from './surgeryPayment.model';

import {
  RecommandationModel,
  RecommandationSchema,
} from './recommandation.modal';

import { Patient, PatientSchema } from '../patients/patient.model';
import { SurgeryService } from './surgery.service';
import { SurgeryRecordModel, SurgeryRecordSchema } from './surgery.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Medecine.name, schema: MedecinSchema },
      {
        name: SurgeryRecordModel.name,
        schema: SurgeryRecordSchema,
      },

      {
        name: DailySurgeryRecordModel.name,
        schema: DailySurgeryRecordSchema,
      },

      {
        name: SurgeryPaymentModel.name,
        schema: SurgeryPaymentRecordSchema,
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
        name: SurgeryRecordModel.name,
        schema: SurgeryRecordSchema,
      },

      {
        name: DailySurgeryRecordModel.name,
        schema: DailySurgeryRecordSchema,
      },
    ]),
  ],
  providers: [SurgeryService],
  controllers: [HospitalizationController],
})
export class SurgeryModule {}
