import { Module } from '@nestjs/common';
import { InvoicesReportController } from './controllers/ambulatory-invoices-report.controller';
import { AmbulatoryInvoicesReportService } from './services/ambulatort-invoices-report.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceRecordSchema } from '../medical-record/invoice.modal';
import { LaboratoryInvoicesReportController } from './controllers/laboratory-invoice-report.controller';
import { LaboratoryInvoicesReportService } from './services/laboratory-invoice-report.service';
import {
  LaboratoryInvoiceRecordSchema,
  LaboratoryInvoice,
} from '../exams/labororatoryInvoice.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LaboratoryInvoice.name, schema: LaboratoryInvoiceRecordSchema },
      { name: Invoice.name, schema: InvoiceRecordSchema },
    ]),
  ],
  controllers: [InvoicesReportController, LaboratoryInvoicesReportController],
  providers: [AmbulatoryInvoicesReportService, LaboratoryInvoicesReportService],
})
export class InvoicesReportModule {}
