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
  CreateMaternityRecommendationDto,
  CreateMaternityRecord,
  UpdateMaternityDepositHistoryDto,
  UpdateMaternityPackageAmount,
  CreateMaternityRecordPaymentDto,
} from './maternity.dto';

import { AuthGuard } from 'src/middlewares/auth.guard';
import { SearchByName } from '../patients/patient.dto';
import { surgeryEmergencyRequest, AuthRequestPayload } from 'src/util/types';
import { MaternityService } from './maternity.service';

@Controller('maternity')
@UseGuards(AuthGuard)
export class MaternityController {
  constructor(private readonly maternityServices: MaternityService) {}

  @Get('record/all/:id')
  getAllForSinglePatients(@Param('id') id: string) {
    return this.maternityServices.getMaternityRecords(id);
  }

  @Post('create-record')
  createMaternityRecord(@Body() body: CreateMaternityRecord) {
    return this.maternityServices.createMaternityRecord(body);
  }

  @Post('update-daily-survey/:id')
  updateDailySurvey(
    @Body() body: createDailySurveyDto,
    @Param('id') id: string,
  ) {
    return this.maternityServices.updateDailySurvey(body, id);
  }

  @Post('create/daily-record')
  createDailySurvey(
    @Body() data: createDailySurveyDto,
    @Req() request: AuthRequestPayload,
  ) {
    data.doctor = request.user.id;
    return this.maternityServices.createDailySurvey(data);
  }

  @Get('find/daily-record/:id')
  getRecordSurvey(@Param('id') id: string) {
    return this.maternityServices.getMaternityRecordSurvey(id);
  }

  @Get('find/maternity-record-details/:id')
  findMaternityRecordDetails(@Param('id') id: string) {
    return this.maternityServices.getMaternityRecordDetails(id);
  }

  @Post('mark-survey-as-completed')
  markSurveyAsCompleted(
    @Body()
    data: {
      id: string;
      target: 'eveningSurvery' | 'morningSurvery' | 'afternoonSurvery';
    },
    @Req() request: AuthRequestPayload,
  ) {
    return this.maternityServices.markSurveyAsCompleted(data, request.user.id);
  }

  @Delete('delete-record-survey/:id')
  deleteMaternityRecordSurvey(@Param('id') id: string) {
    return this.maternityServices.deleteMaternityRecordSurvey(id);
  }

  @Post('update-discount/:id')
  updateMaternityDiscount(
    @Param('id') id: string,
    @Body() body: { discount: number },
  ) {
    return this.maternityServices.updateMaternityDiscount(id, body.discount);
  }

  @Post('create-payment/:id')
  createMaternityPayment(
    @Param('id') id: string,
    @Body() data: CreateMaternityRecordPaymentDto,
    @Req() request: AuthRequestPayload,
  ) {
    data.senderId = request.user.id;
    data.MaternityRecordId = id;
    return this.maternityServices.createMaternityPayment(data);
  }

  @Get('find/payment/withpagination')
  findPaymentsWithPagination(@Query('skip') skip: number) {
    return this.maternityServices.getMaternityPayments(skip);
  }

  @Delete('delete/record/:id')
  deleteMaternityRecord(@Param('id') id: string) {
    return this.maternityServices.deleteMaternityRecord(id);
  }

  @Get('patient/payments/:patientId')
  getPatientPayments(@Param('patientId') patientId: string) {
    return this.maternityServices.getPatientMaternityPayments(patientId);
  }

  @Get('find/payment/statistics')
  getMaternityPaymentStatistics() {
    return this.maternityServices.findMaternityPatientsWithStatistics();
  }

  @Post('create/recommendation')
  createMaternityRecommendation(
    @Body() data: CreateMaternityRecommendationDto,
    @Req() request: AuthRequestPayload,
  ) {
    data.sender = request.user.id;
    return this.maternityServices.createMaternityRecommendation(data);
  }

  @Get('find/all/payments')
  getAllPayments(
    @Query('skip') skip: number,
    @Query('patientType') patientType: string,
  ) {
    return this.maternityServices.findAllMaternityPayments(
      Number(skip),
      patientType,
    );
  }

  @Get('find/day/payments')
  getDayPayments(@Query('patientType') patientType: string) {
    return this.maternityServices.getDayMaternityPayment(patientType);
  }

  @Get('find/month/payments')
  getMonthPayments(@Query('patientType') patientType: string) {
    return this.maternityServices.getMonthMaternityPayment(patientType);
  }

  @Get('find/year/payments')
  getYearPayments(@Query('patientType') patientType: string) {
    return this.maternityServices.getMaternityPaymentRecordedThisYear(
      patientType,
    );
  }

  @Get('get/payment/count')
  getPaymentCount(@Query('patientType') patientType: string) {
    return this.maternityServices.countMaternityPayment(patientType);
  }

  @Get('find/all/patients')
  getAllPatients(
    @Query('skip') skip: number,
    @Query('patientType') patientType: string,
  ) {
    return this.maternityServices.findAllMaternityPatients(
      Number(skip),
      patientType,
    );
  }

  @Post('create-emergency-medicines')
  createEmergencyAdministration(
    @Body() body: surgeryEmergencyRequest,
    @Req() { user }: { user: any },
  ) {
    return this.maternityServices.createMaternityEmergencyAdministration({
      administrator: user.name,
      administration: body,
      MaternityRecordId: body.recordId,
      patientId: body.patientId,
    });
  }

  @Post('update-deposit-history/:recordId')
  updateDepositHistory(
    @Body() body: UpdateMaternityDepositHistoryDto,
    @Param('recordId') recordId: string,
  ) {
    return this.maternityServices.updateDepositHistory(body, recordId);
  }

  @Post('update-package-amount/:recordId')
  updatePackageAmount(
    @Body() body: UpdateMaternityPackageAmount,
    @Param('recordId') recordId: string,
  ) {
    return this.maternityServices.updatePackageAmount(body, recordId);
  }

  @Post('search-by-name')
  searchPatient(@Body() body: SearchByName) {
    return this.maternityServices.findPatientByName(body.name);
  }
}

export { AuthRequestPayload };
