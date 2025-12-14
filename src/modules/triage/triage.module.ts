import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TriageController } from './triage.controller';
import { TriageService } from './triage.service';
import { Triage, TriageSchema } from './triage.model';
import { WebsocketsModule } from 'src/websockets.module';
import { Patient, PatientSchema } from 'src/modules/patients/patient.model';
import {
  AptitudePhysique,
  AptitudePhysiqueSchema,
} from './aptitudePhysique.modal';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Triage.name, schema: TriageSchema }]),
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    MongooseModule.forFeature([
      { name: AptitudePhysique.name, schema: AptitudePhysiqueSchema },
    ]),
    WebsocketsModule,
  ],
  controllers: [TriageController],
  providers: [TriageService],
})
export class TriageModule {}
