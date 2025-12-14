import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import mongoose from 'mongoose';
import { User } from 'src/modules/users/user.model';
import { MaternityRecordModel } from './maternity-record.model';

export type ConclusionRecordDocument = HydratedDocument<ConclusionRecordModel>;

@Schema({ timestamps: true })
export class ConclusionRecordModel {
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patient: Patient;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  doctor: User;

  @Prop({
    required: true,
    ref: User.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  requestAuthor: User;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  assistant: User;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  infirmiere: User;

  @Prop({ required: true })
  conclusion: string;

  @Prop({ required: true })
  files: String[];

  @Prop({
    required: true,
    ref: MaternityRecordModel.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  maternityRecord: MaternityRecordModel;

  createdAt: string;
  updatedAt: string;
}

export const ConclusionRecordSchema = SchemaFactory.createForClass(
  ConclusionRecordModel,
);
