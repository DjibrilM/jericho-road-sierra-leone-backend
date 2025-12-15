import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import { Service } from 'src/modules/service/service.model';
import { User } from 'src/modules/users/user.model';

export type MaternityRequestedExamsDocument =
  HydratedDocument<MaternityRequestedExams>;

@Schema({ timestamps: true })
export class MaternityRequestedExams {
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patient: Patient;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  doctor: User;

  @Prop({
    required: true,
    ref: User.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  requestAuthor: User;

  @Prop({
    required: true,
    ref: User.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  infirmiere: string;

  @Prop({
    required: true,
    ref: User.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  assistant: string;

  @Prop({ required: true })
  requestedExams: string;

  @Prop({ required: true, default: [] })
  files: string[];

  @Prop({
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Service.name }],
  })
  services: Service[];

  @Prop({ default: 'pending' })
  status: string;
}

export const MaternityRequestedExamsSchema = SchemaFactory.createForClass(
  MaternityRequestedExams,
);
