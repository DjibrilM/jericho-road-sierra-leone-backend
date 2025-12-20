import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../users/user.model';
import { Patient } from '../patients/patient.model';
import { MaternityRecordModel } from './maternity.model';

export class Survey {
  medicine: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    checked: boolean;
  }[];
  service: any[];
  status: 'completed' | 'waiting';
  completedBy: string;
  surveillance: string;
}

export type DailyMaternityRecordDocument =
  HydratedDocument<DailyMaternityRecordModel>;

@Schema({ timestamps: true })
export class DailyMaternityRecordModel {
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patient: Patient;

  @Prop({
    required: true,
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  })
  doctor: User;

  @Prop()
  morningSurvey: Survey;

  @Prop()
  afternoonSurvey: Survey;

  @Prop()
  eveningSurvey: Survey;

  @Prop({ default: 'No comment left.' })
  comments: string;

  @Prop()
  attachedImages: string[];

  @Prop({ default: 'active' })
  status: 'completed' | 'active';

  @Prop({
    required: true,
    ref: 'MaternityRecordModel',
    type: mongoose.Schema.Types.ObjectId,
  })
  maternityRecord: MaternityRecordModel;

  @Prop({ default: 0 })
  totalPrice: number;
}

export const DailyMaternityRecordSchema = SchemaFactory.createForClass(
  DailyMaternityRecordModel,
);
