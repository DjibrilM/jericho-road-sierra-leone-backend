import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Service } from '../service/service.model';

import { Patient } from 'src/modules/patients/patient.model';
import { User } from 'src/modules/users/user.model';

export type LaboratoryInvoiceDocument = HydratedDocument<LaboratoryInvoice>;

@Schema({ timestamps: true })
export class LaboratoryInvoice {
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patientId: Patient;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  senderId: User;

  @Prop({ default: [] })
  services: Service[];

  @Prop({ required: false })
  discount: number;

  @Prop({ default: false })
  locked: true;

  @Prop()
  origin: string;

  @Prop()
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

export const LaboratoryInvoiceRecordSchema =
  SchemaFactory.createForClass(LaboratoryInvoice);
