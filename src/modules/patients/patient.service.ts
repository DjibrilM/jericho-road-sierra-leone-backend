import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Patient } from './patient.model';
import { Model } from 'mongoose';
import { CreatePatientDto } from './patient.dto';
import mongoose from 'mongoose';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patienSchema: Model<Patient>,
  ) {}

  async create(patient: CreatePatientDto) {
    try {
      const newPatient = await this.patienSchema.create({
        ...patient,
        status: 'free',
        fullName: (patient.firstName + patient.secondName).toUpperCase(),
      });
      return newPatient;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('failed to create new patient');
    }
  }

  async findAll(skip: number, patientType = '') {
    const getpatients = await this.patienSchema
      .find(
        Boolean(patientType) && patientType !== '0'
          ? { patientType: patientType }
          : {},
      )
      .skip((skip - 1) * 40)
      .limit(40)
      .sort({ createdAt: -1 });

    return getpatients;
  }

  async findOne(id: mongoose.Schema.Types.ObjectId) {
    try {
      const patient = await this.patienSchema.findById(id);
      if (!patient) throw new Error('failed to find the patient');
      return patient;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  remove(id: mongoose.Schema.Types.ObjectId) {
    try {
      return this.patienSchema.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  searchPatientByName(nameSegment: string) {
    try {
      const find = this.patienSchema.find({
        fullName: { $regex: nameSegment, $options: 'i' },
      });
      return find;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getPatientsRecordedToday(): Promise<number> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set the time to the beginning of the day

    try {
      const patients = await this.patienSchema
        .find({
          createdAt: { $gte: today },
        })
        .countDocuments()
        .exec();

      return patients;
    } catch (error) {
      console.log(error);
      throw new Error(`Unable to fetch patients: ${error.message}`);
    }
  }

  async getPatientsRecordedThisMonth(): Promise<Patient[]> {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    try {
      const patients = await this.patienSchema
        .find({
          createdAt: { $gte: firstDayOfMonth },
        })
        .exec();

      return patients;
    } catch (error) {
      console.log(error);
      throw new Error(`Unable to fetch patients: ${error.message}`);
    }
  }

  async getPatientsRecordedThisYear(patientType = ''): Promise<number> {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    try {
      const patients = await this.patienSchema
        .find(
          Boolean(patientType) && patientType !== '0'
            ? {
                createdAt: { $gte: firstDayOfYear },
                patientType: patientType,
              }
            : {
                createdAt: { $gte: firstDayOfYear },
              },
        )
        .countDocuments()
        .exec();

      return patients;
    } catch (error) {
      console.log(error);
      throw new Error(`Unable to fetch patients: ${error.message}`);
    }
  }

  async findByToday(patientType = ''): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.patienSchema
        .find(
          Boolean(patientType) && patientType !== '0'
            ? { createdAt: { $gte: today }, patientType: patientType }
            : { createdAt: { $gte: today } },
        )
        .countDocuments()
        .exec();
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async findByCurrentMonth(patientType = ''): Promise<number> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1); // Set date to the first day of the month
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the next month
      endOfMonth.setDate(0); // Set date to the last day of the previous month
      endOfMonth.setHours(23, 59, 59, 999);

      return this.patienSchema
        .find(
          Boolean(patientType) && patientType !== '0'
            ? {
                patientType: patientType,
                createdAt: {
                  $gte: startOfMonth,
                  $lte: endOfMonth,
                },
              }
            : {
                createdAt: {
                  $gte: startOfMonth,
                  $lte: endOfMonth,
                },
              },
        )
        .countDocuments()
        .exec();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findByCurrentYear(): Promise<Patient[]> {
    try {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const endOfYear = new Date(
        new Date().getFullYear(),
        11,
        31,
        23,
        59,
        59,
        999,
      );
      return this.patienSchema
        .find({ createdAt: { $gte: startOfYear, $lte: endOfYear } })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async fingPatientByDate(data: Date) {
    try {
      const startDate = new Date(data);
      const endDate = new Date(data);
      endDate.setDate(startDate.getDate() + 1);

      return await this.patienSchema.find({
        createdAt: {
          $gte: startDate, // Greater than or equal to startDate
          $lt: endDate, // Less than endDate
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getPatientsCounts(patientType = '') {
    try {
      return await this.patienSchema
        .find(
          Boolean(patientType) && patientType !== '0'
            ? { patientType: patientType }
            : {},
        )
        .countDocuments();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
