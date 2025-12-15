import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceDocument } from 'src/modules/service/service.model';
import { CreateLabResultDto } from '../dto/create-lab-result.dto';
import { CreateRequestedExamsDto } from '../dto/create-requested-exams.dto';

import {
  MaternityLaboratoryInvoice,
  InvoiceDocument,
} from '../models/laboratory-invoice.model';
import { Payment, PaymentDocument } from '../models/laboratory-payment.model';
import {
  MaternityLaboratoryResults,
  MaternityLaboratoryResultsDocument,
} from '../models/maternity-laboratory-results.model';
import {
  MaternityRequestedExams,
  MaternityRequestedExamsDocument,
} from '../models/maternity-requested-exams.model';
import { Service as ServiceModel } from 'src/modules/service/service.model';
import GenerateInvoiceDto from '../dto/ceate-laboratory-invoice.dto';

@Injectable()
export class MaternityService {
  constructor(
    @InjectModel(MaternityRequestedExams.name)
    private readonly requestedExamsModel: Model<MaternityRequestedExamsDocument>,
    @InjectModel(MaternityLaboratoryResults.name)
    private readonly labResultsModel: Model<MaternityLaboratoryResultsDocument>,
    @InjectModel(MaternityLaboratoryInvoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(ServiceModel.name)
    private readonly serviceModel: Model<ServiceDocument>,
  ) {}

  // 1️⃣ Create Requested Exams
  async createRequestedExams(
    dto: CreateRequestedExamsDto,
    requestAuthor: string,
  ) {
    const record = new this.requestedExamsModel({ ...dto, requestAuthor });
    return record.save();
  }

  // 2️⃣ Create Lab Result + auto-generate invoice
  async createLabResult(dto: CreateLabResultDto, requestAuthor: string) {
    const requestedExams = await this.requestedExamsModel.findById(
      dto.requestedExaminationsReference,
    );

    if (requestedExams && requestedExams.status !== 'completed') {
      requestedExams.status = 'completed';
      await requestedExams.save();
    } else if (!requestedExams) {
      throw new NotFoundException('Requested Exams not found');
    } else if (requestedExams.status === 'completed') {
      throw new NotFoundException('Requested Exams already completed');
    }

    const record = new this.labResultsModel({
      ...dto,
      requestAuthor,
      services: requestedExams.services,
    });
    const saved = await record.save();

    await requestedExams.save();
    return saved;
  }

  async createLaboratoryInvoice(
    dto: GenerateInvoiceDto,
    requestedExamsId: string,
  ) {
    const requestedExams =
      await this.requestedExamsModel.findById(requestedExamsId);

    // 1️⃣ Fetch service prices
    const services = await this.serviceModel.find({
      _id: { $in: dto.services },
    });

    if (requestedExams.services.length >= 1)
      throw new BadRequestException('Services already added');

    const totalAmount = services.reduce((sum, s) => sum + s.price, 0);
    await requestedExams.save();

    const findInvoice = await this.invoiceModel.findOne({
      requestedExaminationsReference: requestedExamsId,
    });

    if (findInvoice)
      throw new BadRequestException(
        'An invoice for this record has already been created.',
      );

    console.log(services.map((s) => s._id));

    // 3️⃣ Generate and save invoice
    const invoice = new this.invoiceModel({
      patient: requestedExams.patient,
      services: services.map((s) => s._id),
      totalAmount,
      maternityRecord: dto.maternityRecord,
      requestedExaminationsReference: requestedExamsId,
    });

    requestedExams.services = services.map((s) => s._id as any) || [];
    
    await requestedExams.save();
    await invoice.save();
    return invoice;
  }

  // 3️⃣ Create Payment
  async createPayment(invoiceId: string, method: string, receivedBy?: string) {
    const invoice = await this.invoiceModel.findById(invoiceId);
    if (!invoice) throw new NotFoundException('Invoice not found');

    const paymentAmount = invoice.totalAmount;

    const payment = new this.paymentModel({
      invoice: invoiceId,
      amount: paymentAmount,
      method,
      receivedBy,
    });
    await payment.save();

    invoice.status = 'paid';
    await invoice.save();

    return payment;
  }

  // 4️⃣ Get Patient Invoices (newest first)
  async getPatientInvoices(patientId: string) {
    return this.invoiceModel
      .find({ patient: patientId })
      .populate('services labResult')
      .sort({ createdAt: -1 });
  }

  // 5️⃣ Get requested exams by patient (newest first)
  async getRequestedExams(patientId: string) {
    return this.requestedExamsModel
      .find({ patient: patientId })
      .populate([
        {
          path: 'infirmiere',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        },
        { path: 'patient' },
        {
          path: 'doctor',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        },
        {
          path: 'assistant',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        },
        {
          path: 'requestAuthor',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        },
        { path: 'services' },
      ])
      .sort({ createdAt: -1 });
  }

  // 6️⃣ Get lab results by patient and maternity record (newest first)
  async getLabResults(patientId: string, maternityRecord: string) {
    return this.labResultsModel
      .find({ patient: patientId, maternityRecord })
      .populate([
        {
          path: 'infirmiere',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        },
        { path: 'patient' },
        {
          path: 'doctor',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        },
        {
          path: 'assistant',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        },
        { path: 'requestedExaminationsReference' },
        { path: 'services' },
      ])
      .sort({ createdAt: -1 });
  }
}
