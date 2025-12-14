import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, mongo } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import mongoose from 'mongoose';
import { User } from 'src/modules/users/user.model';
import { MedicalRecord } from './medical-record.model';

export type PayementDocument = HydratedDocument<Payement>;

@Schema({ timestamps: true })
export class Payement {
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patientId: Patient;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  senderId: User;

  @Prop({
    required: false,
    type: [],
  })
  Treatments: any[];

  @Prop({
    required: false,
    type: [],
  })
  prescribeMedecin: any[];

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord',
  })
  attachedMedicalRecordId: MedicalRecord;

  @Prop({ required: false })
  discount: number;

  @Prop({ required: false })
  status: string;
  

  @Prop({ required: true })
  payementMethod: string;
}

export const PayementRecordSchema = SchemaFactory.createForClass(Payement);
