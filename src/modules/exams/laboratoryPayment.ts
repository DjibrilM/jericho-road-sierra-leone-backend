import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, mongo } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import mongoose from 'mongoose';
import { User } from 'src/modules/users/user.model';

export type LaboratoryPayementDocument = HydratedDocument<LaboratoryPayement>;

@Schema({ timestamps: true })
export class LaboratoryPayement {
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

  @Prop({ required: false })
  status: string;

  @Prop({ required: true })
  payementMethod: string;

  @Prop()
  origin: "ambulatory" | "hospitalization";
}

export const laboratoryPayementRecordSchema =
  SchemaFactory.createForClass(LaboratoryPayement);
