import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/modules/users/user.model';
import { Patient } from 'src/modules/patients/patient.model';
import mongoose from 'mongoose';
import { hopsitalizationEmergencyRequest } from 'src/util/types';

@Schema({ timestamps: true })
export class HospitalizationRecordModel extends Document {
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patient: Patient;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  doctor: User;

  @Prop({ required: true })
  plaintes: string;

  @Prop({ required: true })
  historiqueMaladie: string;

  @Prop({ required: true })
  antecedents: string;

  @Prop({ required: true })
  examenPhysique: string;

  @Prop({ required: true })
  systemeRespiratoire: string;

  @Prop({ required: true })
  systemePulmonaire: string;

  @Prop({ required: true })
  systemeGastroIntestinal: string;

  @Prop({ required: true })
  systemeNeurologique: string;

  @Prop({ required: true })
  systemeGenitauxUrinaire: string;

  @Prop({ required: true })
  systemeLocomoteur: string;

  @Prop({ required: true })
  diagnosticDifferentiel: string;

  @Prop({ default: 'active' })
  status: 'active' | 'closed';

  @Prop()
  touched: boolean;

  @Prop({ required: true, default: 0 })
  discount: number;

  @Prop({ required: true })
  attachedImages: string[];

  @Prop({ required: true })
  room: string;

  @Prop()
  @Prop({
    default: [],
    type: [
      {
        created: String,
        administrator: String,
        medicines: [
          {
            createdAt: { type: String, required: true },
            description: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: String, enum: ['1'], required: true },
            quantity: { type: Number, required: true },
            updatedAt: { type: String, required: true },
          },
        ],
      },
    ],
  })
  imergencyMedicinesAdministrations: hopsitalizationEmergencyRequest[];

  @Prop({ default: 0 })
  deposit: number;

  @Prop({ default: [] })
  depositHistory: { createdAt: string; amount: number }[];

  @Prop({ default: 0 })
  packageAmount: number;
}

export const HospitalizationRecordSchema = SchemaFactory.createForClass(
  HospitalizationRecordModel,
);
