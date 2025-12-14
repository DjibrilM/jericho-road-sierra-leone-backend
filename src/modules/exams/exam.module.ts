// src/your/your.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from './exam.model';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { ExamResult, ExamResultSchema } from './examResult.model';
import {
  LaboratoryPayement,
  laboratoryPayementRecordSchema,
} from './laboratoryPayment';

import {
  LaboratoryInvoice,
  LaboratoryInvoiceRecordSchema,
} from './labororatoryInvoice.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),
    MongooseModule.forFeature([
      { name: LaboratoryInvoice.name, schema: LaboratoryInvoiceRecordSchema },
    ]),
    MongooseModule.forFeature([
      { name: ExamResult.name, schema: ExamResultSchema },
    ]),

    MongooseModule.forFeature([
      { name: LaboratoryPayement.name, schema: laboratoryPayementRecordSchema },
    ]),
  ],

  providers: [ExamService],
  controllers: [ExamController],
})
export class ExamModule {}
