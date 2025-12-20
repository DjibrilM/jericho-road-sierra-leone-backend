import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { AuthModule } from './modules/auth/auth.module';
import { PatientModule } from './modules/patients/patient.module';
import { GeneralWebsocketGateway } from './websocket.gateway';
import { MedicalRecordModule } from './modules/medical-record/medical-record.module';
import { TriageModule } from './modules/triage/triage.module';
import { ServiceModule } from './modules/service/service.module';
import { WebsocketsModule } from './websockets.module';
import { ExamModule } from './modules/exams/exam.module';
import { RadiographiesModule } from './modules/radiographies/radiographies.module';
import { EchographieModule } from './modules/echographie/echographie.module';
import { AppointmentModule } from './modules/appointments/appointment.module';
import { config } from 'dotenv';
import { HospitalizationModule } from './modules/hospitalization/hospitalization.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CaseModule } from './modules/cases/case.module';
import { PresenceTrackingModule } from './modules/presence-tracking/presence-tracking.module';
import { PharmacyStoreModule } from './modules/pharmacy-store/items/pharmacy-store.module';
import { InvoicesReportModule } from './modules/invoices-report/invoices-report.module';
import { TriagePediatricModule } from './modules/triage-pediatric/triage-pediatric.module';
import { TriageAdultModule } from './modules/triage-adults/triage-adults.module';
import { SurgeryModule } from './modules/surgery/surgery.module';
import { MaternityModule } from './modules/maternity/maternity.module';

config();

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI),
    UserModule,
    PharmacyModule,
    AuthModule,
    PatientModule,
    MedicalRecordModule,
    TriageModule,
    ServiceModule,
    WebsocketsModule,
    ExamModule,
    RadiographiesModule,
    EchographieModule,
    AppointmentModule,
    HospitalizationModule,
    CaseModule,
    PresenceTrackingModule,
    PharmacyStoreModule,
    InvoicesReportModule,
    TriagePediatricModule,
    TriageAdultModule,
    SurgeryModule,
    MaternityModule,
  ],
  exports: [CaseModule, UserModule],
  controllers: [AppController],
  providers: [AppService, GeneralWebsocketGateway],
})
export class AppModule {}
