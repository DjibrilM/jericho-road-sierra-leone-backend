import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Patient } from '../patients/patient.model';
import { SurgeryRecordModel } from './surgery.model';

@Schema({ timestamps: true })
export class RecommandationModel extends Document {
  @Prop({
    required: true,
    ref: 'HospitalizationRecordModel',
    type: mongoose.Schema.Types.ObjectId,
  })
  surgeryRecord: SurgeryRecordModel;

  @Prop({
    required: true,
    ref: 'Patient',
    type: mongoose.Schema.Types.ObjectId,
  })
  patient: Patient;

  @Prop()
  totalPrice: number;

  @Prop({ required: true })
  recommandation: {
    selectedMedecine: {
      _id: string;
      name: string;
      price: string;
      quantity: 1;
      description: 'telmisartan';
      createdAt: '2024-05-16T12:53:49.927Z';
      updatedAt: '2024-05-16T12:53:49.927Z';
      __v: 0;
      checked: true;
    };
    quantity: string;
    dosagequantity: string;
    instruction: string;
    selectedDosage: { name: string; checked: boolean }[];
    id: '2024-07-09T09:59:42.263Z';
  }[];
}

export const RecommandationSchema =
  SchemaFactory.createForClass(RecommandationModel);
