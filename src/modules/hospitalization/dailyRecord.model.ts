import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { HospitalizationRecordModel } from './hospitalization.model';
import { User } from '../users/user.model';
import { Patient } from '../patients/patient.model';

export class Survery {
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

export type DailyHospitalizzationRecordDocument =
  HydratedDocument<DailyHospitalizationRecordModel>;

@Schema({ timestamps: true })
export class DailyHospitalizationRecordModel {
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patient: Patient;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  doctor: User;

  @Prop()
  morningSurvery: Survery;

  @Prop()
  afternoonSurvery: Survery;

  @Prop()
  eveningSurvery: Survery;

  @Prop({ default: 'No comment left.' })
  comments: string;

  @Prop()
  attachedImages: string[];

  @Prop({ default: 'active' })
  status: 'completed' | 'active';

  @Prop({
    required: true,
    ref: 'HospitalizationRecordModel',
    type: mongoose.Schema.Types.ObjectId,
  })
  hospitalizationRecord: HospitalizationRecordModel;

  @Prop({ default: 0 })
  totalPrice: number;
}

export const DailyHospitalizationRecordSchema = SchemaFactory.createForClass(
  DailyHospitalizationRecordModel,
);


