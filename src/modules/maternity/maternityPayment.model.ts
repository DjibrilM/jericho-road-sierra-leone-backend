import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import mongoose from 'mongoose';
import { User } from 'src/modules/users/user.model';
import { MaternityRecordModel } from './maternity.model';

export type MaternityPaymentDocument = HydratedDocument<MaternityPaymentModel>;

@Schema({ timestamps: true })
export class MaternityPaymentModel {
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patientId: Patient;

  @Prop({
    required: true,
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  })
  senderId: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaternityRecordModel',
  })
  MaternityRecordId: MaternityRecordModel;

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

export const MaternityPaymentRecordSchema = SchemaFactory.createForClass(
  MaternityPaymentModel,
);
