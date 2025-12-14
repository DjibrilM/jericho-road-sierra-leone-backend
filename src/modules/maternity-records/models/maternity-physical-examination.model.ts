import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import { User } from 'src/modules/users/user.model';
import { MaternityRecordModel } from './maternity-record.model';

export type ExamenPhysiqueRecordDocument =
  HydratedDocument<ExamenPhysiqueRecordModel>;

@Schema({ timestamps: true })
export class ExamenPhysiqueRecordModel {
  /** ---------------- Patient & Staff ---------------- */
  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patient: Patient;

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  doctor: User;

  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  assistant?: User;

  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  infirmiere?: User;

  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  admnistrator?: User;

  /** ---------------- Paramètres vitaux ---------------- */
  @Prop() poids?: string; // en kg
  @Prop() taille?: string; // en cm
  @Prop() temperature?: string; // en °C
  @Prop() pouls?: string; // en bpm

  /** ---------------- Observations générales ---------------- */
  @Prop() conjonctives?: string; // ex: normales, pâles
  @Prop() etatGeneral?: string; // ex: bon, fébrile, fatigué

  /** ---------------- Systèmes ---------------- */
  @Prop() systemeRespiratoire?: string;
  @Prop() systemeCirculatoire?: string;
  @Prop() systemeDigestif?: string;
  @Prop() systemeUrinaire?: string;
  @Prop() systemeLocomoteur?: string;
  @Prop() systemeNerveux?: string;
  @Prop() autre?: string; // pour autres constatations

  /** ---------------- Lien maternité ---------------- */
  @Prop({
    ref: MaternityRecordModel.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  record: MaternityRecordModel;

  /** ---------------- Fichiers ---------------- */
  @Prop({ type: [String] })
  files?: string[];

  createdAt: string;
  updatedAt: string;
}

export const ExamenPhysiqueRecordSchema = SchemaFactory.createForClass(
  ExamenPhysiqueRecordModel,
);
