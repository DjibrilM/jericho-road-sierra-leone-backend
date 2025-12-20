import {
  Query,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import {
  createDailySurveyDto,
  CreateSurgeryRecommendationDto,
  CreateSurgeryRecord,
  UpdateSurgeryDepositHistoryDto,
  UpdateSurgeryPackageAmount,
} from './surgery';

import { AuthGuard } from 'src/middlewares/auth.guard';
import { CreateSurgeryRecordPaymentDto } from './surgery';
import { SearchByName } from '../patients/patient.dto';
import { surgeryEmergencyRequest } from 'src/util/types';
import { AuthRequestPayload } from 'src/util/types';
import { SurgeryService } from './surgery.service';

@Controller('surgery')
@UseGuards(AuthGuard)
export class HospitalizationController {
  constructor(private readonly surgeryPaymentServices: SurgeryService) {}

  @Get('record/all/:id')
  async getAllForSinglePatients(@Param('id') id: string) {
    return this.surgeryPaymentServices.getSurgeryRecords(id);
  }

  @Post('create-record')
  async createSurgeryRecord(@Body() body: CreateSurgeryRecord) {
    return await this.surgeryPaymentServices.createSurgeryRecord(body);
  }

  @Post('update-daily-survey/:id')
  async updateDailySurvey(
    @Body() body: createDailySurveyDto,
    @Param('id') id: string,
  ) {
    return await this.surgeryPaymentServices.updateDailySurvey(body, id);
  }

  @Post('create/daily-record')
  async createDailySurvey(
    @Body() data: createDailySurveyDto,
    @Req() request: AuthRequestPayload,
  ) {
    data.doctor = request.user.id;
    return await this.surgeryPaymentServices.createDailySurvey(data);
  }

  @Get('find/daily-record/:id')
  getRecordSurvey(@Param('id') id: string) {
    return this.surgeryPaymentServices.getSurgeryRecordSurvey(id);
  }

  @Get('findHospitalizationRecordDetaild/:id')
  async findSurgeryRecordDetails(@Param() id: string) {
    return await this.surgeryPaymentServices.getSurgeryRecordDetails(id);
  }

  @Post('markSurveyAsCompled')
  async markSurveyAsCompleted(
    @Body()
    data: {
      id: 'string';
      target: 'eveningSurvery' | 'morningSurvery' | 'afternoonSurvery';
    },

    @Req() request: AuthRequestPayload,
  ) {
    return await this.surgeryPaymentServices.markSurveyAsCompleted(
      data,
      request.user.id,
    );
  }

  @Delete('deleteHopitalizationRecordSurvey/:id')
  deleteSurgeryRecordSurvey(@Param('id') id: string) {
    return this.surgeryPaymentServices.deleteSurgeryRecordSurvey(id);
  }

  @Post('updateSurgeryDiscount/:id')
  updateSurgeryDiscount(
    @Param('id') id: string,
    @Body() body: { discount: number },
  ) {
    return this.surgeryPaymentServices.updateHopsitalizationDiscount(
      id,
      body.discount,
    );
  }

  @Post('createSurgeryPayment/:id')
  async createSurgeryPaymentServices(
    @Param('id') id: string,
    @Body() data: CreateSurgeryRecordPaymentDto,
    @Req() request: AuthRequestPayload,
  ) {
    data.senderId = request.user.id;
    data.SurgeryRecordId = id;
    return this.surgeryPaymentServices.createSurgeryPayment(data);
  }

  @Get('find/payment/withpagination')
  async findPaymentsWithPagination(@Query('skip') skip: number) {
    return await this.surgeryPaymentServices.getSurgeryPayments(skip);
  }

  @Delete('delete/surgery/record/:id')
  async deleteHospitalizationRecord(@Param('id') id: string) {
    return this.surgeryPaymentServices.deleteSurgeryRecord(id);
  }

  @Get('patient/payments/:patientId')
  getPatientPayments(@Param('patientId') patientId: string) {
    return this.surgeryPaymentServices.getPatientPayments(patientId);
  }

  @Get('find/surgery/payment')
  async getsurgeryPaymentServicesa() {
    return await this.surgeryPaymentServices.findSurgeryPatientsWithStaticstics();
  }

  @Post('create/recommandation')
  async createSurgeryRecommandation(
    @Body() data: CreateSurgeryRecommendationDto,
    @Req() request: AuthRequestPayload,
  ) {
    data.sender = request.user.id;
    return this.surgeryPaymentServices.createSurgeryRecommendation(data);
  }

  @Get('find/all/payments')
  async getAllHospitalizationPayment(
    @Query('skip') skip: number,
    @Query('patientType') patientType: string,
  ) {
    return await this.surgeryPaymentServices.findAllPayment(
      Number(skip),
      patientType,
    );
  }

  @Get('find/day/payments')
  async getDaySurgeryPayment(@Query('patientType') patientType: string) {
    return await this.surgeryPaymentServices.getDaySurgeryPayment(patientType);
  }

  @Get('find/month/payments')
  async getMonthSurgeryPayment(@Query('patientType') patientType: string) {
    return await this.surgeryPaymentServices.getMonthSurgeryPayment(
      patientType,
    );
  }

  @Get('find/year/payments')
  async getYearSurgeryPayment(@Query('patientType') patientType: string) {
    return await this.surgeryPaymentServices.getSurgeryPaymentRecordedThisYear(
      patientType,
    );
  }

  @Get('get/payment/count')
  async getSurgeryPayment(@Query('patientType') patientType: string) {
    return await this.surgeryPaymentServices.countSurgeryPayment(patientType);
  }

  @Get('find/all/patients')
  async getAllSurgeryPatient(
    @Query('skip') skip: number,
    @Query('patientType') patientType: string,
  ) {
    return await this.surgeryPaymentServices.findAllSurgeryPatients(
      Number(skip),
      patientType,
    );
  }

  @Get('find/day/patients')
  async getDaySurgeryPatient(@Query('patientType') patientType: string) {
    return await this.surgeryPaymentServices.getDaySurgeryPatient(patientType);
  }

  @Get('find/month/patients')
  async getMonthSurgeryPatient(@Query('patientType') patientType: string) {
    return await this.surgeryPaymentServices.getMonthSurgeryPatient(
      patientType,
    );
  }

  @Get('find/year/patients')
  async getYearSurgeryPatient(@Query('patientType') patientType: string) {
    return await this.surgeryPaymentServices.getSurgeryPatientRecordedThisYear(
      patientType,
    );
  }

  @Get('get/patients/count')
  async getSurgeryPatient(@Query('patientType') patientType: string) {
    return await this.surgeryPaymentServices.countSurgeryPatient(patientType);
  }

  @Get('find/by/date')
  async getSurgeryPatientsByDate(@Query('date') date: Date) {
    return await this.surgeryPaymentServices.fingPatientByDate(date);
  }

  @Post('searchByName')
  searchPatient(@Body() body: SearchByName) {
    return this.surgeryPaymentServices.findPatientByName(body.name);
  }

  @Get('get/surgery/payment/by/date')
  async geSurgeryPaymentByDate(@Query('date') date: string) {
    return await this.surgeryPaymentServices.geSurgeryPaymentByDate(date);
  }

  @Post('createSurgery-emergency-medicines')
  async createSurgeryEmergencyAdministration(
    @Body() @Body() body: surgeryEmergencyRequest,
    @Req() { user }: { user: any },
  ) {
    return await this.surgeryPaymentServices.createSurgeryEmergencyAdministration(
      {
        administrator: user.name,
        admistration: body,
        SurgeryRecordId: body.recordId,
        patientId: body.patientId,
      },
    );
  }

  @Post('update-deposit-history/:SurgeryRecord')
  async updateHospitalizationHistory(
    @Body() body: UpdateSurgeryDepositHistoryDto,
    @Param('SurgeryRecord') hospitalizationRecord: string,
  ) {
    return await this.surgeryPaymentServices.updateDepositHistory(
      body,
      hospitalizationRecord,
    );
  }

  @Post('update-packageAmount/:SurgeryRecord')
  async updatePackageAmount(
    @Body() body: UpdateSurgeryPackageAmount,
    @Param('SurgeryRecord') hospitalizationRecord: string,
  ) {
    return await this.surgeryPaymentServices.updatePackageAmount(
      body,
      hospitalizationRecord,
    );
  }
}
export { AuthRequestPayload };
