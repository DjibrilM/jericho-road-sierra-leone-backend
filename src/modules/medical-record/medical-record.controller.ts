import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { Response } from 'express';

import { MedicalRecordService } from './medical-record.service';
import {
  CreateMedicalRecordDto,
  CreatePayementDto,
  UpdateDiscountDto,
} from './medical-record.dto';

import mongoose from 'mongoose';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { Request as requestType } from 'express';
import { CreatePayementUserExtend } from './ineterfaces';
import { AdminCheck } from 'src/middlewares/admin.guard';
import { UpdateMedicalRecordDto } from './medical-record.dto';
import { SearchByName } from '../patients/patient.dto';
import { AuthRequestPayload } from 'src/util/types';

// @Req() request: AuthRequestPayload,
// ) {
//   data.senderId = request.user.id;

@Controller('medical-record')
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  createMedicalRecord(
    @Body() body: CreateMedicalRecordDto,
    @Req() request: AuthRequestPayload,
  ) {
    body.doctorId = request.user.id as any;
    return this.medicalRecordService.createRecord(body);
  }

  @UseGuards(AuthGuard)
  @Post('update')
  updateRecord(@Body() body: UpdateMedicalRecordDto) {
    return this.medicalRecordService.updateRecord(body);
  }

  @UseGuards(AuthGuard)
  @Get('all/:id')
  getMedicalRecords(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.medicalRecordService.getRecords(id);
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminCheck)
  @Get('dayPayament')
  async getDaysPayments() {
    return await this.medicalRecordService.getDailPayment();
  }
  @UseGuards(AuthGuard)
  @UseGuards(AdminCheck)
  @Get('mounthPayment')
  async getMountPayment() {
    return await this.medicalRecordService.getMounthPayment();
  }

  @UseGuards(AdminCheck)
  @Get('yearPayment')
  async getYearPayments() {
    return this.medicalRecordService.getYearPayments();
  }

  @Get('paymentdatacount')
  async getPaymentCount() {
    return await this.medicalRecordService.getPaymentDocumentCount();
  }

  @Get('find/payment/withpagination')
  async findPaymentsWithPagination(@Query('skip') skip: number) {
    return await this.medicalRecordService.findAllWithPagination(skip);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getMedicalRecord(@Param() id: mongoose.Schema.Types.ObjectId) {
    return this.medicalRecordService.deleteRecord(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  DeleteMedicalRecord(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.medicalRecordService.deleteRecord(id);
  }

  @UseGuards(AuthGuard)
  @Get('invoices/:id')
  getInvoice(@Param('id') id: string) {
    return this.medicalRecordService.getInvoice(id);
  }

  @Get('invoice/:id/pdf')
  async downloadInvoice(@Param('id') id: string, @Res() res: Response) {
    return this.medicalRecordService.downloadInvoicePDF(id, res);
  }

  @UseGuards(AuthGuard)
  @Get('invoices/all/:id')
  getInvoices(@Param('id') id: string) {
    return this.medicalRecordService.getInvoices(id);
  }

  @UseGuards(AuthGuard)
  @Get('invoices/discount/add/:id')
  addDiscount(@Param('id') id: string) {
    return this.medicalRecordService.getInvoices(id);
  }

  @UseGuards(AuthGuard)
  @Post('discount/update/:id')
  async updateDiscount(
    @Param('id') id: string,
    @Body() body: UpdateDiscountDto,
  ) {
    return this.medicalRecordService.updateDiscount(id, body.discount);
  }

  @UseGuards(AuthGuard)
  @Post('payement')
  creatPayement(
    @Body() data: CreatePayementDto,
    @Request() request: requestType & CreatePayementUserExtend,
  ) {
    return this.medicalRecordService.createPayament(data, request.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('patient-payements/:patientId')
  getPatientPayements(@Param('patientId') id: string) {
    return this.medicalRecordService.getPatientPayements(id);
  }

  @UseGuards(AuthGuard)
  @Get('payement/:id')
  getPayement(@Param('id') id: string) {
    return this.medicalRecordService.getPayement(id);
  }

  //============= THE BELLOW  CODE IS ABOUT FILTERING PATIENTS ATTACHED TO EACH MEDICAL RECORD ======
  @Get('find/all/patients')
  async getAllHospitalizationPatient(
    @Query('skip') skip: number,
    @Query('patientType') patientType: string,
  ) {
    return await this.medicalRecordService.findAllAmbilatoryPatients(
      Number(skip),
      patientType,
    );
  }

  @Get('count/day/case')
  async getDayHospitalizationPatient(
    @Query('patientType') patientType: string,
  ) {
    return await this.medicalRecordService.countAllAmbulatoryCasesByDay(
      patientType,
    );
  }

  @Get('count/month/case')
  async getMonthHospitalizationPatient(
    @Query('patientType') patientType: string,
  ) {
    return await this.medicalRecordService.countAllAmbulatoryCasesByMonth(
      patientType,
    );
  }

  @Get('count/year/case')
  async getYearHospitalizationPatient(
    @Query('patientType') patientType: string,
  ) {
    return await this.medicalRecordService.countAllAmbulatoryCasesByYear(
      patientType,
    );
  }

  @Get('count/all/cases')
  async countAllMedicalRecord(@Query('patientType') patientType: string) {
    return await this.medicalRecordService.countAllAmbulatoryCases(patientType);
  }

  @Get('filter/patient/by/date')
  async getHospitalizationPatientsByDate(@Query('date') date: Date) {
    return await this.medicalRecordService.fingPatientsByDate(date);
  }

  @Post('search/by/name')
  searchPatient(@Body() body: SearchByName) {
    return this.medicalRecordService.findPatientByName(body.name);
  }

  @Get('get/medical-record-day-medicine-payment')
  async getMedicalRecordDayPayment(@Query('date') date: string) {
    return await this.medicalRecordService.getTodaysMedicalRecordsPayment(date);
  }

  @Get('get/day-services-payment')
  async getMedicalRecordDayServicePayment(@Query('date') date: string) {
    return await this.medicalRecordService.getTodaysMedicalRecordsServicePayment(
      date,
    );
  }
}
