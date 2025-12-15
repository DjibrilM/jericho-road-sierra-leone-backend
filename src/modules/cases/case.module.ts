import { Module } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Case } from './cases.model';
import { CaseSchema } from './cases.model';
import { CaseRecord } from './caseRecord.model';
import { CaseRecordSchema } from './caseRecord.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Case.name, schema: CaseSchema }]),
    MongooseModule.forFeature([
      { name: CaseRecord.name, schema: CaseRecordSchema },
    ]),
  ],

  controllers: [CasesController],
  providers: [CasesService],
  exports: [
    MongooseModule.forFeature([{ name: Case.name, schema: CaseSchema }]),
    MongooseModule.forFeature([
      { name: CaseRecord.name, schema: CaseRecordSchema },
    ]),
  ],
})
export class CaseModule {}
