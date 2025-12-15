import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, mongo } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import { User } from '../users/user.model';
import { HospitalizationRecordModel } from './hospitalization.model';
import mongoose from 'mongoose';


export type HospitalizationDepositPayementDocument =
  HydratedDocument<HospitalizationDepositModel>;

  @Schema({ timestamps: true })
  class HospitalizationDepositModel {
    @Prop({
      required: true,
      ref: 'Patient',
      type: mongoose.Schema.Types.ObjectId,
    })
    patient: Patient;

    @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
    senderId: User;

    @Prop({
      required: true,
      ref: 'HospitalizationRecordModel',
      type: mongoose.Schema.Types.ObjectId,
    })
    hospitalizationRecord: HospitalizationRecordModel;
  }

  export const HospitalizationDepositSchame = SchemaFactory.createForClass(
    HospitalizationDepositModel,
  );
