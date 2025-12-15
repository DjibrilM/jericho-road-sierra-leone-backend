import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Patient } from 'src/modules/patients/patient.model';
import { MaternityLaboratoryResults } from './maternity-laboratory-results.model';
import { Service } from 'src/modules/service/service.model';
import { MaternityRecordModel } from './maternity-record.model';
import { MaternityRequestedExams } from './maternity-requested-exams.model';

export type InvoiceDocument = HydratedDocument<MaternityLaboratoryInvoice>;

@Schema({
  timestamps: true,
})
export class MaternityLaboratoryInvoice {
  @Prop({
    ref: 'Patient',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  patient: Patient;

  @Prop({
    ref: 'MaternityLaboratoryResults',
    type: mongoose.Schema.Types.ObjectId,
  })
  labResult: MaternityLaboratoryResults;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: MaternityRecordModel.name,
  })
  maternityRecord: string;

  @Prop({
    required: true,
    ref: MaternityRequestedExams.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  requestedExaminationsReference: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Service.name }],
    required: true,
  })
  services: Service[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 'unpaid', enum: ['unpaid', 'paid', 'partial'] })
  status: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(
  MaternityLaboratoryInvoice,
);
