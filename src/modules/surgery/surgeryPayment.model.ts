import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import mongoose from 'mongoose';
import { User } from 'src/modules/users/user.model';
import { SurgeryRecordModel } from './surgery.model';

export type SurgeryPaymentDocument = HydratedDocument<SurgeryPaymentModel>;

@Schema({ timestamps: true })
export class SurgeryPaymentModel {
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patientId: Patient;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  senderId: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SurgeryRecordModel',
  })
  SurgeryRecordId: SurgeryRecordModel;

  @Prop({ required: false })
  discount: number;

  @Prop({ required: true })
  payementMethod: string;

  @Prop()
  price: number;

  @Prop({ default: 0 })
  totalSpending: number;

  @Prop()
  patientType: string;
}

export const SurgeryPaymentRecordSchema =
  SchemaFactory.createForClass(SurgeryPaymentModel);
