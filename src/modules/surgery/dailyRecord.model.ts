import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SurgeryRecordModel } from './surgery.model';
import { User } from '../users/user.model';
import { Patient } from '../patients/patient.model';

export class Survey {
  medicine: {
    _id: string;
    name: string;
    price: number;
    quantity: 2;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    checked: true;
  }[];
  service: any[];
  status: 'completed' | 'waiting';
  comepletedBy: string;
  sureveillance: string;
}

export type DailySurgeryRecordDocument =
  HydratedDocument<DailySurgeryRecordModel>;

@Schema({ timestamps: true })
export class DailySurgeryRecordModel {
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patient: Patient;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  doctor: User;

  @Prop()
  morningSurvery: Survey;

  @Prop()
  afternoonSurvery: Survey;

  @Prop()
  eveningSurvery: Survey;

  @Prop({ default: 'No comment left.' })
  comments: string;

  @Prop()
  attachedImages: string[];

  @Prop({ default: 'active' })
  status: 'completed' | 'active';

  @Prop({
    required: true,
    ref: 'SurgeryRecordModel',
    type: mongoose.Schema.Types.ObjectId,
  })
  surgeryRecord: SurgeryRecordModel;

  @Prop({ default: 0 })
  totalPrice: number;
}

export const DailySurgeryRecordSchema = SchemaFactory.createForClass(
  DailySurgeryRecordModel,
);
