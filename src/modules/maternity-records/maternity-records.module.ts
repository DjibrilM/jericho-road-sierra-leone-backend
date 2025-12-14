import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { ActivePhaseSurveillanceService } from './services/active-phase-surveillance.service';
import { MaternityPhysicalExaminationService } from './services/maternityPhysicalExamination.service';
import { MaternityRecordsService } from './services/maternity-records.service';
import { MaternityService } from './services/laboratory.service';

import {
  ActivePhaseSurveillanceModel,
  ActivePhaseSurveillanceSchema,
} from './models/active-phase-surveillance.model';

import {
  MaternityRecordSchema,
  MaternityRecordModel,
} from './models/maternity-record.model';

import {
  PartogrammeRecordModel,
  partogrammeRecordSchema,
} from './models/partogramme-record.model';

import {
  ExamenPhysiqueRecordModel,
  ExamenPhysiqueRecordSchema,
} from './models/maternity-physical-examination.model';

import {
  ConclusionRecordModel,
  ConclusionRecordSchema,
} from './models/maternity-conclusion.model';

import {
  MaternityLaboratoryInvoice,
  InvoiceSchema,
} from './models/laboratory-invoice.model';

import { Payment, PaymentSchema } from './models/laboratory-payment.model';

import {
  MaternityLaboratoryResults,
  MaternityLaboratoryResultsSchema,
} from './models/maternity-laboratory-results.model';

import {
  MaternityRequestedExams,
  MaternityRequestedExamsSchema,
} from './models/maternity-requested-exams.model';

import { serviceSchema, Service } from '../service/service.model';

import { ExamenPhysiqueController } from './controllers/examenPhysiqueController.controller';
import { MaternityRecordsController } from './controllers/maternity-records.controller';
import { ActivePhaseSurveillanceController } from './controllers/activePhaseSurveillance.controller';
import { MaternityController } from './controllers/maternity-laboratory.controller';
import { ConclusionRecordController } from './controllers/conclusion.controller';
import { ConclusionRecordService } from './services/maternity-conclusion.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MaternityRecordModel.name, schema: MaternityRecordSchema },
      { name: PartogrammeRecordModel.name, schema: partogrammeRecordSchema },
      {
        name: ActivePhaseSurveillanceModel.name,
        schema: ActivePhaseSurveillanceSchema,
      },
      {
        name: ExamenPhysiqueRecordModel.name,
        schema: ExamenPhysiqueRecordSchema,
      },
      { name: ConclusionRecordModel.name, schema: ConclusionRecordSchema },
      {
        name: MaternityLaboratoryResults.name,
        schema: MaternityLaboratoryResultsSchema,
      },
      { name: MaternityLaboratoryInvoice.name, schema: InvoiceSchema },
      { name: Payment.name, schema: PaymentSchema },
      {
        name: MaternityRequestedExams.name,
        schema: MaternityRequestedExamsSchema,
      },
      { name: Service.name, schema: serviceSchema },
    ]),
  ],

  controllers: [
    MaternityRecordsController,
    ExamenPhysiqueController,
    ActivePhaseSurveillanceController,
    MaternityController,
    ConclusionRecordController,
  ],

  providers: [
    MaternityRecordsService,
    MaternityPhysicalExaminationService,
    ActivePhaseSurveillanceService,
    MaternityService,
    ConclusionRecordService,
  ],
})
export class MaternityRecordsModule {}
