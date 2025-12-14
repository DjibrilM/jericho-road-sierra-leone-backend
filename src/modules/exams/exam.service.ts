import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Exam } from './exam.model';

import { CreateRequestedExamenDto, createExamReusltDto } from './exam.dto';
import { ExamResult } from './examResult.model';
import { LaboratoryInvoice } from './labororatoryInvoice.model';
import { LaboratoryPayement } from './laboratoryPayment';
import { CreatePayementDto } from 'src/modules/medical-record/medical-record.dto';
import creatRequestedServicesInvoiceDto from './creatRequestedServicesInvoiceDto.dt';

@Injectable()
export class ExamService {
  constructor(
    @InjectModel(Exam.name)
    private readonly examModel: Model<Exam>,
    @InjectModel(ExamResult.name)
    private readonly examResultModel: Model<ExamResult>,

    @InjectModel(LaboratoryInvoice.name)
    private readonly laboratoryInvoiceModel: Model<LaboratoryInvoice>,

    @InjectModel(LaboratoryPayement.name)
    private readonly laboratoryPaymentModel: Model<LaboratoryPayement>,
  ) {}

  async create(
    createRequestedExamenDto: CreateRequestedExamenDto,
    requestAuthor: string,
  ): Promise<Exam> {
    try {
      const createdExam = await this.examModel.create({
        ...createRequestedExamenDto,
        doctorId: requestAuthor,
      });
      return createdExam;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async creatRequestedServicesInvoice(
    { patientId, selectedServices }: creatRequestedServicesInvoiceDto,
    userId: string,
    requestedExamsId: string,
  ) {
    const findRequestedExamsRecord = await this.examModel.findById(requestedExamsId)
    
    if (findRequestedExamsRecord.addedServices) throw new BadRequestException();
    
      await this.laboratoryInvoiceModel.create({
        patientId: patientId,
        senderId: userId,
        services: selectedServices,
      });

    await this.examModel.findByIdAndUpdate(requestedExamsId, {
      addedServices: true,
    });

    return 'Record successfully created';
  }

  async findExamsForUser(patientId: string): Promise<Exam[]> {
    return this.examModel
      .find({ patientId: patientId })
      .populate('doctorId')
      .populate('patientId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Exam> {
    const exam = await this.examModel.findById(id).exec();
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }
    return exam;
  }

  async update(
    id: string,
    updateRequestedExamenDto: CreateRequestedExamenDto,
  ): Promise<Exam> {
    const updatedExam = await this.examModel
      .findByIdAndUpdate(id, updateRequestedExamenDto, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!updatedExam) {
      throw new NotFoundException('Exam not found');
    }
    return updatedExam;
  }

  async delete(id: string): Promise<void> {
    const result = await this.examModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Exam not found');
    }
  }

  async createExamResult(data: createExamReusltDto) {
    try {
      const createdExam = await this.examResultModel.create(data);

      return createdExam;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create result');
    }
  }

  async findExamsResults(id: mongoose.Schema.Types.ObjectId) {
    try {
      const data = await this.examResultModel
        .find({ patientId: id })
        .populate('doctorId')
        .populate('patientId')
        .sort({ createdAt: -1 })
        .exec();
      return data;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findExamResult(id: mongoose.Schema.Types.ObjectId) {
    try {
      const data = await this.examModel.findById(id);
      return data;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async fetchLaboratoryInvoice(id: string) {
    try {
      return this.laboratoryInvoiceModel
        .find({ patientId: id })
        .populate('senderId')
        .populate('patientId')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async fetchLaboratoryInvoiceDetail(id: string) {
    try {
      return this.laboratoryInvoiceModel
        .findById(id)
        .populate('senderId')
        .populate('patientId');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createlaboratoryPayment(data: CreatePayementDto, senderId: string) {
    try {
      const findInvoice = await this.laboratoryInvoiceModel.findById(
        data.invoiceId,
      );
      if (!findInvoice) throw new BadRequestException('Invoice not found');

      const payment = await this.laboratoryPaymentModel.create({
        Treatments: [...findInvoice.services],
        discount: findInvoice.discount,
        patientId: data.patientId,
        payementMethod: data.payementMethod,
        senderId: senderId,
        origin: findInvoice.origin,
      });

      findInvoice.locked = true;
      findInvoice.save();

      return payment;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  //Find all lobarotory payments
  async getLaboratoryPaymentsWithPagination({
    skip,
    origin,
    pageLimit = 50,
  }: {
    skip: number;
    origin: string;
    pageLimit?: number;
  }) {
    try {
      const find = await this.laboratoryPaymentModel
        .find({ origin })
        .populate('patientId')
        .populate('senderId')
        .skip((skip - 1) * 10)
        .limit(pageLimit)
        .sort({ createdAt: -1 });

      return find;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getLaboratoryPayment(id: string) {
    try {
      const payment = await this.laboratoryPaymentModel
        .findById(id)
        .populate('patientId')
        .populate('senderId');

      if (!payment) throw new NotFoundException();

      return payment;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getPatientLaboratoryPayements(id: string) {
    try {
      const payments = this.laboratoryPaymentModel
        .find({ patientId: id })
        .populate('patientId')
        .populate('senderId');

      return payments;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getAmbulatoryLaboratoryPaymentsByDate(date: string) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 0, 0);

    const find = await this.laboratoryPaymentModel.find({
      origin: 'ambulatory',
      createdAt: {
        $gte: startDate, // Greater than or equal to startDate
        $lt: endDate, // Less than endDate
      },
    });

    return find;
  }

  async findAllAmbilatoryPatients(skip = 1, orgin = '') {
    if (!skip) {
      throw new UnauthorizedException('skip not provided');
    }
    try {
      const payments = await this.laboratoryPaymentModel
        .find({
          origin: orgin,
        })
        .populate('patientId')
        .populate('patientId')
        .skip((Number(skip) - 1) * 40)
        .limit(40)
        .sort({ createdAt: -1 });

      return payments;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //Find all hospitalization laboratory payments by date
  async getHospitalizationLaboratoryPayments(date: string) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 0, 0);

    const find = await this.laboratoryPaymentModel.find({
      origin: 'hospitalization',
      createdAt: {
        $gte: startDate, // Greater than or equal to startDate
        $lt: endDate, // Less than endDate
      },
    });

    const total = find
      .map((element) => element.Treatments)
      .flat()
      .reduce((acc, current) => acc + Number(current.price), 0);

    return { totalPrice: total, records: find };
  }

  async countDayPayments(orgin: string) {
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Set the time to the beginning of the day

      return await this.laboratoryPaymentModel.find({
        origin: orgin,
        createdAt: { $gte: today },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async counMonthPayments(orgin: string) {
    try {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );

      return await this.laboratoryPaymentModel.find({
        origin: orgin,
        createdAt: { $gte: firstDayOfMonth },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async countYearPayments(orgin: string) {
    try {
      const today = new Date();
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

      return await this.laboratoryPaymentModel.find({
        origin: orgin,
        createdAt: { $gte: firstDayOfYear },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async countLaboratoryPaymentsByOrigin(origin = '') {
    try {
      return await this.laboratoryPaymentModel
        .find({ origin: origin })
        .countDocuments();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
