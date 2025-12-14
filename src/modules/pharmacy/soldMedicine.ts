import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Patient } from '../patients/patient.model';
import { User } from '../users/user.model';

export type SoldMedicineDocument = HydratedDocument<SoldMedicineModel>;

@Schema({ timestamps: true })
export class SoldMedicineModel {
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patientId: Patient;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({
    required: true,
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  })
  from: User;

  @Prop({ required: true })
  origin: '';

  @Prop({ required: true })
  medicineName: string;
}

export const SoldMedecinSchema =
  SchemaFactory.createForClass(SoldMedicineModel);
