import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import { User } from 'src/modules/users/user.model';

@Schema({ timestamps: true })
export class AptitudePhysique {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' })
  patient: Patient;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  doctor: User;

  @Prop({ required: true, default: 5 })
  price: number;

  @Prop({ default: false })
  payed: boolean;
}

export type AptitudePhysiqueDocument = AptitudePhysique & Document;

export const AptitudePhysiqueSchema =
  SchemaFactory.createForClass(AptitudePhysique);
