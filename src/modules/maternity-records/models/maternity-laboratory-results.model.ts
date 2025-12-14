import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import { Service } from 'src/modules/service/service.model';
import { User } from 'src/modules/users/user.model';
import { MaternityRequestedExams } from './maternity-requested-exams.model';
import { MaternityRecordModel } from './maternity-record.model';

export type MaternityLaboratoryResultsDocument =
  HydratedDocument<MaternityLaboratoryResults>;

@Schema({ timestamps: true })
export class MaternityLaboratoryResults {
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patient: Patient;

  @Prop({
    required: true,
    ref: User.name,
    type: mongoose.Schema.Types.ObjectId,
  })
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

  @Prop({
    required: true,
    ref: MaternityRequestedExams.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  requestedExaminationsReference: string;

  @Prop({
    required: true,
    ref: MaternityRecordModel.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  maternityRecord: MaternityRecordModel;

  @Prop({
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Service.name }],
  })
  services: Service[];

  // --- New laboratory result fields ---
  @Prop({ type: String })
  groupeSanguin?: string;

  @Prop({ type: String })
  hematocrite?: string;

  @Prop({ type: String })
  tdrDuPaludisme?: string;

  @Prop({ type: String })
  grossesseExamen?: string;

  @Prop({ type: String })
  albumiurie?: string;

  @Prop({ type: String })
  rprPourSyphilis?: string;

  @Prop({ type: String })
  examenCytoBacteriologiqueUrines?: string;

  @Prop({ type: String })
  autresObservations?: string;

  @Prop({
    default: [],
    type: [{ verdict: String, name: String, description: String }],
  })
  verdicts: ExamVeridicts[];

  // --- Attachments ---
  @Prop({ type: [String], default: [] })
  files?: string[];
}

export type ExamVeridicts = {
  name: string;
  verdict: string;
  description: string;
};

export const MaternityLaboratoryResultsSchema = SchemaFactory.createForClass(
  MaternityLaboratoryResults,
);
