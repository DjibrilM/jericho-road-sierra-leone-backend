import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import mongoose from 'mongoose';
import { User } from 'src/modules/users/user.model';

export type MedicalRecordDocument = HydratedDocument<MedicalRecord>;

@Schema({ timestamps: true })
export class MedicalRecord {
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patientId: Patient;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  doctorId: User;

  @Prop({ required: true })
  complains: string;

  @Prop({ required: true })
  Teteetcou: string;

  @Prop({ required: true })
  Thorax: string;

  @Prop({ required: true })
  Abdomen: string;

  @Prop({ required: true })
  ApparreilLocomoteur: string;

  @Prop({ required: true })
  ExaenOrl: string;

  @Prop({ required: false })
  Diagnosis: string;

  @Prop({ required: true })
  complémentdanamnèse: string;

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

  @Prop()
  attachedImages: string[];

  @Prop()
  locked: boolean;

  @Prop()
  historyOfTheDisease: string;

  @Prop()
  antecedent: string;

  @Prop()
  etatGeneral: string;

  @Prop()
  priseEnCharge: string;

  @Prop()
  patientType: string;
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
