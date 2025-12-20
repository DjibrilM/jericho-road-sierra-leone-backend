import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import { User } from '../users/user.model';

import mongoose from 'mongoose';
import { MaternityRecordModel } from '../maternity-records/models/maternity-record.model';

export type HospitalizationDepositPayementDocument =
  HydratedDocument<HospitalizationDepositModel>;

@Schema({ timestamps: true })
class HospitalizationDepositModel {
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patient: Patient;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  senderId: User;

  @Prop({
    required: true,
    ref: MaternityRecordModel.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  SurgeryRecord: MaternityRecordModel;
}

export const SurgeryDepositSchema = SchemaFactory.createForClass(
  HospitalizationDepositModel,
);
