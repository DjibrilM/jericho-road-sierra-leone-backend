import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, mongo } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import mongoose from 'mongoose';
import { User } from 'src/modules/users/user.model';
import { Medecine } from 'src/modules/pharmacy/pharmacy.model';
import { MedicalRecord } from './medical-record.model';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {
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
  })
  Treatments: {
    _id: string;
    name: string;
    price: number;
    description: string;
    type: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
  }[];

  @Prop({
    required: false,
    type: [
      {
        id: {
          required: true,
          type: {},
        },
        quantity: { type: Number, required: true },
        dosage: { type: [String], required: true },
        instruction: { type: String, required: true },
        dosageQuantity: { type: Number, required: true },
      },
    ],
  })
  prescribeMedecin: {
    id: Medecine;
    quantity: number;
    dosage: string[];
    instruction: string;
    dosageQuantity: number;
  }[];

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

  @Prop({ default: false })
  locked: boolean;

  createdAt: string;

  updatedAt: string;

  @Prop({ default: 'Normal' })
  invoicePatientType:
    | 'Personnelle'
    | 'Normal'
    | 'NHC'
    | 'ECZ'
    | 'Coopérative Umoja Ni Nguvu'
    | 'ISIG'
    | 'MT'
    | 'Johanniter';
}

export const InvoiceRecordSchema = SchemaFactory.createForClass(Invoice);
