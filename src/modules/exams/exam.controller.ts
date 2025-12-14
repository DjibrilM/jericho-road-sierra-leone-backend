// src/your/exam.controller.ts
import {
  Request,
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  NotFoundException,
  UseGuards,
  Query,
  Req,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateRequestedExamenDto } from './exam.dto';
import { createExamReusltDto } from './exam.dto';
import { Exam } from './exam.model';
import mongoose from 'mongoose';
import { CreatePayementDto } from 'src/modules/medical-record/medical-record.dto';
import { Request as requestType } from 'express';
import { CreatePayementUserExtend } from 'src/modules/medical-record/ineterfaces';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { AuthRequestPayload } from '../hospitalization/hospitalization.controller';
import CreatRequestedServicesInvoiceDto from './creatRequestedServicesInvoiceDto.dt';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createRequestedExamenDto: CreateRequestedExamenDto,
    @Req() request: AuthRequestPayload,
  ): Promise<Exam> {
    const userId = request.user.id;
    return this.examService.create(createRequestedExamenDto, userId);
  }

  @UseGuards(AuthGuard)
  @Patch('create-invoice/:requestedExamsId')
  creatRequestedServicesInvoice(
    @Body() body: CreatRequestedServicesInvoiceDto,
    @Req() request: AuthRequestPayload,
    @Param('requestedExamsId') requestedExamsId: string,
  ) {
    if (!requestedExamsId) throw new BadRequestException();

    return this.examService.creatRequestedServicesInvoice(
      body,
      request.user.id,
      requestedExamsId,
    );
  }

  @UseGuards(AuthGuard)
  @Get('find/laboratoryInvoices/:id')
  async fetchLaboratoryInvoice(@Param('id') id: string) {
    return this.examService.fetchLaboratoryInvoice(id);
  }

  @UseGuards(AuthGuard)
  @Get('laboratory/invoice/:id')
  async getLaboratoryInvoice(@Param('id') id: string) {
    return this.examService.fetchLaboratoryInvoiceDetail(id);
  }

  @UseGuards(AuthGuard)
  @Get('find/all/:userId')
  async findExamsForUser(@Param('userId') userId: string): Promise<Exam[]> {
    return this.examService.findExamsForUser(userId);
  }

  @UseGuards(AuthGuard)
  @Get('find/:id')
  async findById(@Param('id') id: string): Promise<Exam> {
    try {
      return this.examService.findById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRequestedExamenDto: CreateRequestedExamenDto,
  ): Promise<Exam> {
    try {
      return this.examService.update(id, updateRequestedExamenDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      return this.examService.delete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('create-exam-result')
  async createExamResult(
    @Body() createExamResultDto: createExamReusltDto,
  ): Promise<any> {
    try {
      return await this.examService.createExamResult(createExamResultDto);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @UseGuards(AuthGuard)
  @Get('find/all/exam-results/:id')
  async getExamResults(@Param('id') patientId: mongoose.Schema.Types.ObjectId) {
    return this.examService.findExamsResults(patientId);
  }

  @Get('find/all/exam-result/:id')
  async getExamResult(@Param('id') patientId: mongoose.Schema.Types.ObjectId) {
    return this.examService.findExamResult(patientId);
  }

  @UseGuards(AuthGuard)
  @Post('create/laboratory/payment')
  async createLaboratoryPayment(
    @Body() body: CreatePayementDto,
    @Request() request: requestType & CreatePayementUserExtend,
  ) {
    return await this.examService.createlaboratoryPayment(
      body,
      request.user.id,
    );
  }

  @UseGuards(AuthGuard)
  @Get('laboratory/payment/:id')
  async getLaboratoryPayment(@Param('id') id: string) {
    return this.examService.getLaboratoryPayment(id);
  }

  @UseGuards(AuthGuard)
  @Get('laboratory/payments/:id')
  async getLaboratoryPayments(@Param('id') id: string) {
    return this.examService.getPatientLaboratoryPayements(id);
  }

  @UseGuards()
  @Get('getAmbulatoryLaboratoryPayments')
  async getAmbulatoryLaboratoryPayments(@Query('date') date: string) {
    return await this.examService.getAmbulatoryLaboratoryPaymentsByDate(date);
  }

  @UseGuards()
  @Get('getHospitalizationLaboratoryPayments')
  async getHospitalizationLaboratoryPayments(@Query('date') date: string) {
    return await this.examService.getHospitalizationLaboratoryPayments(date);
  }

  @Get('find/payment/withpagination')
  async findPaymentsWithPagination(
    @Query('skip') skip: number,
    @Query('origin') origin: string,
    @Query('pageLimit') pageLimit: number,
  ) {
    return await this.examService.getLaboratoryPaymentsWithPagination({
      origin: origin,
      skip: skip,
      pageLimit: pageLimit,
    });
  }

  @Get('find/day-count/payment')
  async findDayCountPayments(@Query('origin') origin: string) {
    return await this.examService.countDayPayments(origin);
  }

  @Get('find/mounth-count/payment')
  async findMonthCountPayments(@Query('origin') orgin: string) {
    return await this.examService.counMonthPayments(orgin);
  }

  @Get('find/year-count/payment')
  async findYearCountPayments(@Query('origin') orgin: string) {
    return await this.examService.countYearPayments(orgin);
  }

  @Get('count-all-laboratory-payments')
  async countAllLaboratoryPayments(@Query('origin') orgin: string) {
    return await this.examService.countLaboratoryPaymentsByOrigin(orgin);
  }
}
