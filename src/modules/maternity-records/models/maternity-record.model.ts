import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import mongoose from 'mongoose';
import { User } from 'src/modules/users/user.model';

export type MaternityRecorddDocument = HydratedDocument<MaternityRecordModel>;

@Schema({ timestamps: true })
export class MaternityRecordModel {
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
  administrator: User;

  @Prop({ required: true })
  plaintes: string;

  @Prop({ required: true })
  admission: string[];

  @Prop({ required: true })
  surveillancePhaseActiveGte4cm: string[];

  @Prop({ required: true })
  accouchement: string[];

  @Prop({ required: true })
  surveillancePostPartumImmediatEtTardif: string[];

  @Prop({ required: true })
  SurveillanceDeLaPhaseDeLatence4cm: string[];

  @Prop({ default: false })
  touched: boolean;
}

export const MaternityRecordSchema = SchemaFactory.createForClass(MaternityRecordModel);
