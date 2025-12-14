import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateLabResultDto } from '../dto/create-lab-result.dto';
import { CreateRequestedExamsDto } from '../dto/create-requested-exams.dto';
import { MaternityService } from '../services/laboratory.service';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { AuthRequestPayload } from 'src/util/types';
import CreateLaboratoryInvoiceDto from '../dto/ceate-laboratory-invoice.dto';

@Controller('maternity-records')
@UseGuards(AuthGuard)
export class MaternityController {
  constructor(private readonly maternityService: MaternityService) {}

  // 1️⃣ Create Requested Exams
  @Post('requested-exams')
  @UseGuards(AuthGuard)
  async createRequestedExams(
    @Body() dto: CreateRequestedExamsDto,
    @Req() request: AuthRequestPayload,
  ) {
    return this.maternityService.createRequestedExams(dto, request.user.id);
  }

  // 2️⃣ Create Lab Result (auto-generates invoice)
  @Post('lab-results')
  async createLabResult(
    @Body() dto: CreateLabResultDto,
    @Req() request: AuthRequestPayload,
  ) {
    return this.maternityService.createLabResult(dto, request.user.id);
  }

  // 3️⃣ Make Payment (amount from invoice automatically)
  @Post('invoice/:invoiceId/payment')
  async createPayment(
    @Param('invoiceId') invoiceId: string,
    @Body('method') method: string,
    @Body('receivedBy') receivedBy?: string,
  ) {
    return this.maternityService.createPayment(invoiceId, method, receivedBy);
  }

  @Post('create-laboratory-invoice/:requestedExamsId')
  createLaboratoryInvoice(
    @Body() body: CreateLaboratoryInvoiceDto,
    @Param('requestedExamsId') requestedExamsId: string,
  ) {
    return this.maternityService.createLaboratoryInvoice(
      body,
      requestedExamsId,
    );
  }

  // 4️⃣ Get all invoices for a patient
  @Get('patient/:patientId/invoices')
  async getPatientInvoices(@Param('patientId') patientId: string) {
    return this.maternityService.getPatientInvoices(patientId);
  }

  // 5️⃣ Get all requested exams for a patient
  @Get('patient/:patientId/requested-exams')
  async getRequestedExams(@Param('patientId') patientId: string) {
    return this.maternityService.getRequestedExams(patientId);
  }

  // 6️⃣ Get all lab results for a patient
  @Get('patient/:patientId/:maternityRecord/lab-results')
  async getLabResults(
    @Param('patientId') patientId: string,
    @Param('maternityRecord') maternityRecord: string,
  ) {
    return this.maternityService.getLabResults(patientId, maternityRecord);
  }
}
