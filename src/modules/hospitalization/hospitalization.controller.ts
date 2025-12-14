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
  createDailySurverDto,
  CreateHospitalizationRecommdationDto,
} from './hospitalization.dto';
import { CreateHopitalizationRecord } from './hospitalization.dto';
import { HospitalizationService } from './hospitalization.service';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { CreateHospitalizationRecordPayamentDto } from './hospitalization.dto';
import { SearchByName } from '../patients/patient.dto';
import { hopsitalizationEmergencyRequest } from 'src/util/types';
import { AuthRequestPayload } from 'src/util/types';


@Controller('hospitalization')
@UseGuards(AuthGuard)
export class HospitalizationController {
  constructor(
    private readonly hospitalizationPaymentServices: HospitalizationService,
  ) {}

  @Get('record/all/:id')
  async getAllForSinlePatients(@Param('id') id: string) {
    return this.hospitalizationPaymentServices.getHopitalizationRecords(id);
  }

  @Post('create-record')
  async createHopitalizationrecord(@Body() body: CreateHopitalizationRecord) {
    return await this.hospitalizationPaymentServices.createhopitalizatonRecord(
      body,
    );
  }

  @Post('update-daily-survey/:id')
  async updateDailySurvey(
    @Body() body: createDailySurverDto,
    @Param('id') id: string,
  ) {
    return await this.hospitalizationPaymentServices.updateDailySurvey(
      body,
      id,
    );
  }

  @Post('create/daily-record')
  async createdaylySurvey(
    @Body() data: createDailySurverDto,
    @Req() request: AuthRequestPayload,
  ) {
    data.doctor = request.user.id;
    return await this.hospitalizationPaymentServices.createdailySurvey(data);
  }

  @Get('find/daily-record/:id')
  getRecordSurvey(@Param('id') id: string) {
    return this.hospitalizationPaymentServices.getHospitalizationRecordSurvey(
      id,
    );
  }

  @Get('findHospitalizationRecordDetaild/:id')
  async findHospitalizationRecordDetaild(@Param() id: string) {
    return await this.hospitalizationPaymentServices.getHospitalizationRecordDetails(
      id,
    );
  }

  @Post('markSurveyAsCompled')
  async markSurveyAsCompled(
    @Body()
    data: {
      id: 'string';
      target: 'eveningSurvery' | 'morningSurvery' | 'afternoonSurvery';
    },
  ) {
    return await this.hospitalizationPaymentServices.markSurveyAsCompled(data);
  }

  @Delete('deleteHopitalizationRecordSurvey/:id')
  deleteHopitalizationRecordSurvey(@Param('id') id: string) {
    return this.hospitalizationPaymentServices.deleteHopitalizationRecordSurvey(
      id,
    );
  }

  @Post('updateHospitalizationDiscount/:id')
  updateHospitalizationDiscount(
    @Param('id') id: string,
    @Body() body: { discount: number },
  ) {
    return this.hospitalizationPaymentServices.updateHopsitalizationDiscount(
      id,
      body.discount,
    );
  }

  @Post('createHospitalizationPayment/:id')
  async createhospitalizationPaymentServices(
    @Param('id') id: string,
    @Body() data: CreateHospitalizationRecordPayamentDto,
    @Req() request: AuthRequestPayload,
  ) {
    data.senderId = request.user.id;
    data.HospitalizationRecordId = id;
    return this.hospitalizationPaymentServices.createHospitalizationPayment(
      data,
    );
  }

  @Get('find/payment/withpagination')
  async findPaymentsWithPagination(@Query('skip') skip: number) {
    return await this.hospitalizationPaymentServices.getHospitalizationPayments(
      skip,
    );
  }

  @Delete('delete/hospitalization/record/:id')
  async deleteHospitalizationRecord(@Param('id') id: string) {
    return this.hospitalizationPaymentServices.deleteHospitalizationRecord(id);
  }

  @Get('patient/payments/:patientId')
  getPatientPayments(@Param('patientId') patientId: string) {
    return this.hospitalizationPaymentServices.getPatientPayments(patientId);
  }

  @Get('find/hospitalization/payment')
  async gethospitalizationPaymentServicesa() {
    return await this.hospitalizationPaymentServices.findHospitalizationPatientsWithStaticstics();
  }

  @Post('create/recommandation')
  async createhospitalizationRecommandation(
    @Body() data: CreateHospitalizationRecommdationDto,
    @Req() request: AuthRequestPayload,
  ) {
    data.sender = request.user.id;
    return this.hospitalizationPaymentServices.createHospitalizationRecommandation(
      data,
    );
  }

  @Get('find/all/payments')
  async getAllHospitalizationPayment(
    @Query('skip') skip: number,
    @Query('patientType') patientType: string,
  ) {
    return await this.hospitalizationPaymentServices.findAllPayment(
      Number(skip),
      patientType,
    );
  }

  @Get('find/day/payments')
  async getDayHospitalizationPayment(
    @Query('patientType') patientType: string,
  ) {
    return await this.hospitalizationPaymentServices.getDayhospitalizationPayment(
      patientType,
    );
  }

  @Get('find/month/payments')
  async getMonthHospitalizationPayment(
    @Query('patientType') patientType: string,
  ) {
    return await this.hospitalizationPaymentServices.getMonthHospitalizationPayment(
      patientType,
    );
  }

  @Get('find/year/payments')
  async getYearHospitalizationPayment(
    @Query('patientType') patientType: string,
  ) {
    return await this.hospitalizationPaymentServices.getHospitalizationPaymentRecordedThisYear(
      patientType,
    );
  }

  @Get('get/payment/count')
  async getHospitalizationPayment(@Query('patientType') patientType: string) {
    return await this.hospitalizationPaymentServices.countHospitalizationPayment(
      patientType,
    );
  }

  @Get('find/all/patients')
  async getAllHospitalizationPatient(
    @Query('skip') skip: number,
    @Query('patientType') patientType: string,
  ) {
    return await this.hospitalizationPaymentServices.findAllHospitalizationPatients(
      Number(skip),
      patientType,
    );
  }

  @Get('find/day/patients')
  async getDayHospitalizationPatient(
    @Query('patientType') patientType: string,
  ) {
    return await this.hospitalizationPaymentServices.getDayhospitalizationPatient(
      patientType,
    );
  }

  @Get('find/month/patients')
  async getMonthHospitalizationPatient(
    @Query('patientType') patientType: string,
  ) {
    return await this.hospitalizationPaymentServices.getMonthHospitalizationPatient(
      patientType,
    );
  }

  @Get('find/year/patients')
  async getYearHospitalizationPatient(
    @Query('patientType') patientType: string,
  ) {
    return await this.hospitalizationPaymentServices.getHospitalizationPatientRecordedThisYear(
      patientType,
    );
  }

  @Get('get/patients/count')
  async getHospitalizationPatient(@Query('patientType') patientType: string) {
    return await this.hospitalizationPaymentServices.countHospitalizationPatient(
      patientType,
    );
  }

  @Get('find/by/date')
  async getHospitalizationPatientsByDate(@Query('date') date: Date) {
    return await this.hospitalizationPaymentServices.fingPatientByDate(date);
  }

  @Post('searchByName')
  searchPatient(@Body() body: SearchByName) {
    return this.hospitalizationPaymentServices.findPatientByName(body.name);
  }

  @Get('get/hospitalization/payment/by/date')
  async geHospitalizationPaymentByDate(@Query('date') date: string) {
    return await this.hospitalizationPaymentServices.geHospitalizationPaymentByDate(
      date,
    );
  }

  @Post('createHospitalization-emergency-medicines')
  async createHospitalizationEmergencyAdministration(
    @Body() @Body() body: hopsitalizationEmergencyRequest,
    @Req() { user }: { user: any },
  ) {
    return await this.hospitalizationPaymentServices.createHospitalizationEmergencyAdministration(
      {
        administrator: user.name,
        admistration: body,
        hospitalizationRecordId: body.recordId,
        patientId: body.patientId,
      },
    );
  }
}
export { AuthRequestPayload };

