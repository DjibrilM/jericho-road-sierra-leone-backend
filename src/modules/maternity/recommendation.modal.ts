import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Patient } from '../patients/patient.model';
import { MaternityRecordModel } from '../maternity-records/models/maternity-record.model';

@Schema({ timestamps: true })
export class MaternityRecommandationModel extends Document {
  @Prop({
    required: true,
    ref: 'MaternityRecordModel',
    type: mongoose.Schema.Types.ObjectId,
  })
  maternityRecord: MaternityRecordModel;

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
      quantity: number;
      description: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
      checked: boolean;
    };
    quantity: string;
    dosagequantity: string;
    instruction: string;
    selectedDosage: { name: string; checked: boolean }[];
    id: string;
  }[];
}

export const MaternityRecommandationSchema = SchemaFactory.createForClass(
  MaternityRecommandationModel,
);
