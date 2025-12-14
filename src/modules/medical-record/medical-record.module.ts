import { Module } from '@nestjs/common';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordController } from './medical-record.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalRecord, MedicalRecordSchema } from './medical-record.model';
import { Invoice, InvoiceRecordSchema } from './invoice.modal';
import { PayementRecordSchema, Payement } from './payement.model';
import { Service, serviceSchema } from 'src/modules/service/service.model';
import { MedecinSchema, Medecine } from 'src/modules/pharmacy/pharmacy.model';
import { SoldMedicineModel, SoldMedecinSchema } from '../pharmacy/soldMedicine';
import { Patient, PatientSchema } from '../patients/patient.model';

@Module({
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService],
  imports: [
    MongooseModule.forFeature([
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
      { name: SoldMedicineModel.name, schema: SoldMedecinSchema },
      { name: Invoice.name, schema: InvoiceRecordSchema },
      { name: Payement.name, schema: PayementRecordSchema },
      { name: Service.name, schema: serviceSchema },
      { name: Medecine.name, schema: MedecinSchema },
      { name: Patient.name, schema: PatientSchema },
    ]),
  ],

  exports: [
    MongooseModule.forFeature([
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
    ]),
  ],
})
export class MedicalRecordModule {}
