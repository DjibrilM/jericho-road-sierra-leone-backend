import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Mongoose } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Case } from './cases.model';
import { Patient } from '../patients/patient.model';
import { User } from '../users/user.model';

export type CaserecordDocument = HydratedDocument<CaseRecord>;

@Schema({ timestamps: true })
export class CaseRecord {
  @Prop({ required: true, ref: 'Case', type: mongoose.Schema.Types.ObjectId })
  case: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patient: string;

  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  creator: string;

  @Prop({ required: false })
  record: string;
}

export const CaseRecordSchema = SchemaFactory.createForClass(CaseRecord);
