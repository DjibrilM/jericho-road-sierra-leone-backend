/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Patient, PatientSchema } from '../patients/patient.model';
import { Medecine, MedecinSchema } from '../pharmacy/pharmacy.model';
import { SoldMedicineModel, SoldMedecinSchema } from '../pharmacy/soldMedicine';

import { MaternityRecordModel, MaternityRecordSchema } from './maternity.model';
import {
  DailyMaternityRecordModel,
  DailyMaternityRecordSchema,
} from './dailyRecord.model';
import {
  MaternityPaymentModel,
  MaternityPaymentRecordSchema,
} from './maternityPayment.model';
import {
  MaternityRecommandationModel,
  MaternityRecommandationSchema,
} from './recommendation.modal';

import { MaternityService } from './maternity.service';
import { MaternityController } from './maternity.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Medecine.name, schema: MedecinSchema },
      { name: SoldMedicineModel.name, schema: SoldMedecinSchema },
      { name: MaternityRecordModel.name, schema: MaternityRecordSchema },
      {
        name: DailyMaternityRecordModel.name,
        schema: DailyMaternityRecordSchema,
      },
      {
        name: MaternityPaymentModel.name,
        schema: MaternityPaymentRecordSchema,
      },
      {
        name: MaternityRecommandationModel.name,
        schema: MaternityRecommandationSchema,
      },
    ]),
  ],
  providers: [MaternityService],
  controllers: [MaternityController],
  exports: [
    MongooseModule.forFeature([
      { name: MaternityRecordModel.name, schema: MaternityRecordSchema },
      {
        name: DailyMaternityRecordModel.name,
        schema: DailyMaternityRecordSchema,
      },
    ]),
  ],
})
export class MaternityModule {}
