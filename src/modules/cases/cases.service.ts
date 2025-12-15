import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { Case } from './cases.model';
import { CaseRecord } from './caseRecord.model';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  CreateCaseDto,
  CreateCaseRecordDto,
  CaseRecordsListDto,
} from './cases.dto';

@Injectable()
export class CasesService {
  constructor(
    @InjectModel(Case.name) private caseSchema: Model<Case>,
    @InjectModel(CaseRecord.name) private caseRecordSchema: Model<CaseRecord>,
  ) {}

  async createCases(createServiceDto: CreateCaseDto) {
    try {
      const createServce = await this.caseSchema.create({
        ...createServiceDto,
      });

      return createServce;
    } catch (error) {
      throw new InternalServerErrorException('failed to create service');
    }
  }

  async findAllCases() {
    try {
      const services = await this.caseSchema
        .find()
        .sort({ createdAt: -1 })
        .exec();
      return services;
    } catch (error) {
      return new InternalServerErrorException('failed to load services');
    }
  }

  async createCaseRecord(data: CaseRecordsListDto, user: string) {
    try {
      data.records.forEach(async (record) => {
        const newRecord = new this.caseRecordSchema();
        newRecord.name = record.name;
        newRecord.patient = record.patient;
        newRecord.creator = user;
        newRecord.case = record.case;
        newRecord.record = record.record;

        await newRecord.save();
      });
      return 'Record succesfully saved';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to create the case record',
      );
    }
  }

  //the following function fectches all cases records related to a mdedical record or hospitalization record
  async getRecordCases(recordId: string) {
    try {
      return this.caseRecordSchema.find({ record: recordId });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to retrieve the cases.');
    }
  }

  async getRecordCasesByDate(date: Date, id: string) {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 0, 0);

      const caseId = new mongoose.Types.ObjectId(id);
      const cases = await this.caseRecordSchema
        .find({
          case: caseId,
          createdAt: {
            $gte: startDate, // Greater than or equal to startDate
            $lt: endDate, // Less than endDate
          },
        })
        .populate('creator')
        .populate('patient');

      return cases;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getRecordCasesByMonth(date: Date, id: string) {
    try {
      const startDate = new Date(date);
      startDate.setDate(1); // Set date to the first day of the month
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);

      endDate.setMonth(startDate.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);

      const caseId = new mongoose.Types.ObjectId(id);
      const cases = await this.caseRecordSchema
        .find({
          case: caseId,
          createdAt: {
            $gte: startDate, // Greater than or equal to startDate
            $lt: endDate, // Less than endDate
          },
        })
        .populate('creator')
        .populate('patient');

      return cases;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getRecordCasesByCaseId(skip = 1, id: string) {
    if (!skip) {
      throw new UnauthorizedException('skip not provided');
    }
    try {
      const cases = await this.caseRecordSchema
        .find({ record: id })
        .populate('patient')
        .populate('creator')
        .skip((Number(skip) - 1) * 40)
        .limit(40)
        .sort({ createdAt: -1 });

      return cases;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getCountCasesByCaseId(id: string) {
    try {
      const caseId = new mongoose.Types.ObjectId(id);
      const cases = await this.caseRecordSchema
        .find({ case: caseId })
        .countDocuments();

      return cases;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async countTodayCaseRecords(id: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const caseId = new mongoose.Types.ObjectId(id);
      return this.caseRecordSchema
        .find({ case: caseId, createdAt: { $gte: today } })
        .countDocuments()
        .exec();
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async countMonthlyCaseRecords(id: string) {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1); // Set date to the first day of the month
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the next month
      endOfMonth.setDate(0); // Set date to the last day of the previous month
      endOfMonth.setHours(23, 59, 59, 999);

      const caseId = new mongoose.Types.ObjectId(id);
      return await this.caseRecordSchema
        .find({
          case: caseId,
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        })
        .countDocuments()
        .exec();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `Unable to fetch patients: ${error.message}`,
      );
    }
  }

  async countYearlyCaseRecords(id: string) {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    try {
      const caseId = new mongoose.Types.ObjectId(id);
      const casesCount = await this.caseRecordSchema
        .find({
          case: caseId,
          createdAt: { $gte: firstDayOfYear },
        })
        .countDocuments()
        .exec();

      return casesCount;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `Unable to fetch patients: ${error.message}`,
      );
    }
  }
}
