import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import {
  CreateMaternityRecommendationDto,
  CreateMaternityRecord,
  CreateMaternityRecordPaymentDto,
  UpdateMaternityDepositHistoryDto,
  UpdateMaternityPackageAmount,
  createDailySurveyDto,
} from './maternity.dto';

import { MaternityPaymentModel } from './maternityPayment.model';
import { MaternityRecordModel } from './maternity.model';
import { DailyMaternityRecordModel } from './dailyRecord.model';
import { MaternityRecommandationModel } from './recommendation.modal';
import { SoldMedicineModel } from '../pharmacy/soldMedicine';
import { Patient } from '../patients/patient.model';

import { Medecine } from '../pharmacy/pharmacy.model';
import { maternityEmergencyRequest } from 'src/util/types';

@Injectable()
export class MaternityService {
  constructor(
    @InjectModel(Medecine.name) private medecinSchema: Model<Medecine>,
    @InjectModel(MaternityRecordModel.name)
    private MaternityRecordModel: Model<MaternityRecordModel>,

    @InjectModel(DailyMaternityRecordModel.name)
    private DailyMaternityRecord: Model<DailyMaternityRecordModel>,

    @InjectModel(MaternityPaymentModel.name)
    private MaternityPaymentModel: Model<MaternityPaymentModel>,

    @InjectModel(Patient.name)
    private patientModal: Model<Patient>,

    @InjectModel(MaternityRecommandationModel.name)
    private recommendationModal: Model<MaternityRecommandationModel>,

    @InjectModel(SoldMedicineModel.name)
    private soldMedicineModel: Model<SoldMedicineModel>,
  ) {}

  async createMaternityRecord(data: CreateMaternityRecord) {
    return await this.MaternityRecordModel.create(data);
  }

  async getMaternityRecords(patient: string) {
    return await this.MaternityRecordModel.find({ patient })
      .populate({
        path: 'doctor',
        select:
          '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
      })
      .populate('patient')
      .sort({ createdAt: -1 });
  }

  async getMaternityRecordDetails(id: string) {
    try {
      const constructId = new mongoose.Types.ObjectId(id);
      const maternityRecommendation = await this.recommendationModal.findOne({
        MaternityRecord: constructId,
      });

      const MaternityRecord = await this.MaternityRecordModel.findOne({
        _id: constructId,
      })
        .populate('patient')
        .populate('doctor');

      const dailySurvey = await this.DailyMaternityRecord.find({
        maternityRecord: constructId,
      }).populate('doctor');

      const getMaternityPayment = await this.MaternityPaymentModel.findOne({
        MaternityRecordId: constructId,
      });

      return {
        MaternityRecord: MaternityRecord,
        dailySurvey,
        paymentTotalPrice: getMaternityPayment?.price || null,
        payement: getMaternityPayment,
        recommendation: maternityRecommendation
          ? maternityRecommendation['recommendation']
          : null,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createDailySurvey(data: createDailySurveyDto) {
    const MaternityRecord = await this.MaternityRecordModel.findById(
      data.MaternityRecord,
    );

    if (MaternityRecord.status === 'closed') {
      throw new UnauthorizedException('Unauthorized action.');
    }

    //mark the maternity record as touched
    await this.MaternityRecordModel.findByIdAndUpdate(data.MaternityRecord, {
      touched: true,
    });

    const totalAmountServices =
      data.morningSurvey['service'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      ) +
      data.afternoonSurvey['service'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      ) +
      data.eveningSurvey['service'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      );

    const totalAmountMedicine =
      data.morningSurvey['medicine'].reduce(
        (acc: number, el) => acc + Number(el.price),
        0,
      ) +
      data.afternoonSurvey['medicine'].reduce(
        (acc: number, el) => acc + Number(el.price),
        0,
      ) +
      data.eveningSurvey['medicine'].reduce(
        (acc: number, el) => acc + Number(el.price),
        0,
      );

    return await this.DailyMaternityRecord.create({
      ...data,
      maternityRecord: data.MaternityRecord,
      totalPrice: totalAmountServices + totalAmountMedicine,
    });
  }

  async updateDailySurvey(data: createDailySurveyDto, id: string) {
    const totalAmountServices =
      data.morningSurvey['service'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      ) +
      data.afternoonSurvey['service'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      ) +
      data.eveningSurvey['service'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      );

    const totalAmountMedicine =
      data.morningSurvey['medicine'].reduce(
        (ac: number, el) => ac + Number(el.price),
        0,
      ) +
      data.afternoonSurvey['medicine'].reduce(
        (ac: number, el) => ac + Number(el.price),
        0,
      ) +
      data.eveningSurvey['medicine'].reduce(
        (ac: number, el) => ac + Number(el.price),
        0,
      );

    const constructId = new mongoose.Types.ObjectId(id);
    const update = await this.DailyMaternityRecord.findOneAndUpdate(
      { _id: constructId },
      {
        ...data,
        maternityRecord: data.MaternityRecord,
        totalPrice: totalAmountServices + totalAmountMedicine,
      },
    );

    return update;
  }

  async getMaternityRecordSurvey(id: string) {
    return await this.DailyMaternityRecord.find({
      maternityRecord: id,
    })
      .populate('maternityRecord')
      .populate('doctor')
      .populate('patient')
      .sort({ createdAt: -1 });
  }

  async markSurveyAsCompleted(
    {
      id,
      target,
    }: {
      target: 'eveningSurvery' | 'morningSurvery' | 'afternoonSurvery';
      id: string;
    },
    requestAuthor: string,
  ) {
    const survey = await this.DailyMaternityRecord.findById(id);

    switch (target) {
      case 'morningSurvery':
        survey['morningSurvery'].medicine.forEach(async (medicine) => {
          await this.soldMedicineModel.create({
            medicineName: medicine.name,
            price: medicine.price,
            from: survey.doctor,
            origin: 'Maternity',
            quantity: 1,
            patientId: survey.patient,
          });
        });

        survey.morningSurvey.status = 'completed';
        survey.morningSurvey.completedBy = requestAuthor;
        break;
      case 'eveningSurvery':
        survey['eveningSurvery'].medicine.forEach(async (medicine) => {
          await this.soldMedicineModel.create({
            medicineName: medicine.name,
            price: medicine.price,
            from: survey.doctor,
            origin: 'Maternity',
            quantity: 1,
            patientId: survey.patient,
          });
        });

        survey.eveningSurvey.status = 'completed';
        survey.eveningSurvey.completedBy = requestAuthor;
        break;
      case 'afternoonSurvery':
        survey['afternoonSurvery'].medicine.forEach(async (medicine) => {
          await this.soldMedicineModel.create({
            medicineName: medicine.name,
            price: medicine.price,
            from: survey.doctor,
            origin: 'Maternity',
            quantity: 1,
            patientId: survey.patient,
          });
        });
        survey.afternoonSurvey.status = 'completed';
        survey.afternoonSurvey.completedBy = requestAuthor;
        break;
      default:
        console.log('nothing passed');
        break;
    }

    if (
      survey['morningSurvery'].status === 'completed' ||
      survey['afternoonSurvery'].status === 'completed' ||
      survey['eveningSurvery'].status === 'completed'
    ) {
      survey.status = 'completed';
    }

    const save = await this.DailyMaternityRecord.findOneAndUpdate(survey._id, {
      ...survey,
    });

    return save;
  }

  async updateMaternityDiscount(id: string, discount: number) {
    return await this.MaternityRecordModel.findByIdAndUpdate(id, {
      discount: discount,
    });
  }

  async deleteMaternityRecordSurvey(id: string) {
    const findOne = await this.DailyMaternityRecord.findById(id);
    if (findOne.status === 'completed') {
      throw new UnauthorizedException('can not delete a completed record');
    }
    return await this.DailyMaternityRecord.findByIdAndDelete(id);
  }

  async createMaternityPayment(data: CreateMaternityRecordPaymentDto) {
    const MaternityRecord = await this.MaternityRecordModel.findById(
      data.MaternityRecordId,
    );

    const maternityRecommendation = await this.recommendationModal.findOne({
      MaternityRecord: data.MaternityRecordId,
    });

    const constructId = new mongoose.Types.ObjectId(data.MaternityRecordId);
    const surveys = await this.DailyMaternityRecord.find({
      MaternityRecord: constructId,
    });

    const totalPrice = surveys.reduce(
      (acc, currentEl) => acc + currentEl.totalPrice,
      0,
    );

    await this.MaternityRecordModel.findByIdAndUpdate(data.MaternityRecordId, {
      status: 'closed',
    });

    const patient = await this.patientModal.findById(data.patientId);

    const administratedEmergencyMedicinesTotalPrice = (
      await this.MaternityRecordModel.findById(data.MaternityRecordId)
    ).emergencyMedicinesAdministrations
      .map((element) => element.medicines)
      .flat()
      .reduce((acc, currentElement) => acc + Number(currentElement.price), 0);

    return await this.MaternityPaymentModel.create({
      ...data,
      totalSpending:
        totalPrice +
        administratedEmergencyMedicinesTotalPrice +
        (maternityRecommendation?.totalPrice || 0),
      patientType: patient.patientType || '',
      price: MaternityRecord.packageAmount,
    });
  }

  private calaculateRecommendation(data: CreateMaternityRecommendationDto) {
    let recommendedMedicine = 0;
    const promise = new Promise((resolve) => {
      if (data.recommandedMedicine) {
        data.recommandedMedicine.forEach(async (element, index) => {
          const medicine = await this.medecinSchema.findById(
            element.selectedMedecine._id,
          );

          if (Number(element.quantity) > medicine.quantity) {
            throw new UnauthorizedException('Unauthorized action');
          }

          medicine.quantity = medicine.quantity - Number(element.quantity);
          recommendedMedicine +=
            Number(element.selectedMedecine.price) * Number(element.quantity);

          if (medicine.quantity === 0) {
            await this.medecinSchema.findByIdAndDelete(
              element.selectedMedecine._id,
            );
          } else {
            await this.medecinSchema.findByIdAndUpdate(
              element.selectedMedecine._id,
              {
                quantity: medicine.quantity,
              },
              { new: true },
            );
          }

          if (index + 1 === data.recommandedMedicine.length) {
            resolve(recommendedMedicine);
          }
        });
      }
    });

    return promise;
  }

  async createMaternityRecommendation(data: CreateMaternityRecommendationDto) {
    try {
      const checkIfAlreadyCreated = await this.recommendationModal.findOne({
        MaternityRecord: data.MaternityRecord,
      });

      if (checkIfAlreadyCreated) {
        throw new ConflictException();
      }

      const recommendedMedicineTotalPrice =
        await this.calaculateRecommendation(data);
      const patient = new mongoose.Types.ObjectId(data.patient);
      const MaternityRecord = new mongoose.Types.ObjectId(data.MaternityRecord);

      return await this.recommendationModal.create({
        recommendation: data.recommandedMedicine,
        patient: patient,
        MaternityRecord: MaternityRecord,
        totalPrice: recommendedMedicineTotalPrice,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // Remaining methods: rename Surgery -> Maternity everywhere in function names, variables, and model usage
  // but keep logic identical. Examples: getMaternityPayments, findMaternityPatientsWithStatistics, etc.

  // ... (for brevity, the rest of the methods follow the same renaming pattern)

  async getMaternityPayments(skip: number) {
    try {
      const payments = await this.MaternityRecordModel.find()
        .populate('patientId')
        .populate('senderId')
        .skip((skip - 1) * 10)
        .limit(10)
        .sort({ createdAt: -1 });

      return payments;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteMaternityRecord(id: string) {
    const record = this.MaternityRecordModel.findById(id);
    if ((await record).touched) {
      throw new UnauthorizedException('Action not allowed');
    }
    return await this.MaternityRecordModel.findByIdAndDelete(id);
  }

  async findMaternityPatientsWithStatistics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

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

    const dailyPatient = await this.MaternityRecordModel.find({
      createdAt: { $gte: today },
    });
    const monthlyPayment = this.MaternityRecordModel.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const yearlyPayment = this.MaternityRecordModel.find({
      createdAt: { $gte: startOfYear, $lte: endOfYear },
    }).exec();

    return {
      dailyPatient,
      monthlyPayment,
      yearlyPayment,
    };
  }

  async getPatientMaternityPayments(patientId: string) {
    return this.MaternityPaymentModel.find({ patientId })
      .populate('MaternityRecordId')
      .populate('senderId')
      .populate('patientId');
  }

  async getDayMaternityPayment(patientType = ''): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.MaternityPaymentModel.find(
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

  async getMaternityPaymentByDate(date: string) {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 0, 0);

      const find = await this.MaternityPaymentModel.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      })
        .populate('senderId')
        .populate('patientId')
        .populate('MaternityRecordId');

      const totalPrice = find.reduce(
        (acc, currentItem) => acc + currentItem.price,
        0,
      );

      return {
        records: find,
        sold: totalPrice,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findAllMaternityPayments(skip: number, patientType = '') {
    if (!skip) {
      throw new UnauthorizedException('skip not provided');
    }
    try {
      const getpatients = await this.MaternityPaymentModel.find(
        Boolean(patientType) && patientType !== '0'
          ? { patientType: patientType }
          : {},
      )
        .populate('MaternityRecordId')
        .populate('senderId')
        .skip((Number(skip) - 1) * 40)
        .limit(40)
        .sort({ createdAt: -1 });

      return getpatients;
    } catch (error) {
      console.log(error.message);
    }
  }

  async getMonthMaternityPayment(patientType = ''): Promise<number> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      return this.MaternityPaymentModel.find(
        Boolean(patientType) && patientType !== '0'
          ? {
              patientType: patientType,
              createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            }
          : {
              createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            },
      )
        .countDocuments()
        .exec();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getMaternityPaymentRecordedThisYear(patientType = ''): Promise<number> {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    try {
      const patients = await this.MaternityPaymentModel.find(
        Boolean(patientType) && patientType !== '0'
          ? { createdAt: { $gte: firstDayOfYear }, patientType: patientType }
          : { createdAt: { $gte: firstDayOfYear } },
      )
        .countDocuments()
        .exec();

      return patients;
    } catch (error) {
      console.log(error);
      throw new Error(`Unable to fetch patients: ${error.message}`);
    }
  }

  async countMaternityPayment(patientType = '') {
    try {
      return await this.MaternityPaymentModel.find(
        Boolean(patientType) && patientType !== '0'
          ? { patientType: patientType }
          : {},
      ).countDocuments();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async getDayMaternityPatient(patientType = ''): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.MaternityRecordModel.find(
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

  async findAllMaternityPatients(skip = 1, patientType = '') {
    if (!skip) {
      throw new UnauthorizedException('skip not provided');
    }
    try {
      const getpatients = await this.MaternityRecordModel.find(
        Boolean(patientType) && patientType !== '0'
          ? { patientType: patientType }
          : {},
      )
        .populate('patient')
        .skip((Number(skip) - 1) * 40)
        .limit(40)
        .sort({ createdAt: -1 });

      return getpatients.map((el) => el.patient);
    } catch (error) {
      console.log(error.message);
    }
  }

  async getMonthMaternityPatient(patientType = ''): Promise<number> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      return this.MaternityRecordModel.find(
        Boolean(patientType) && patientType !== '0'
          ? {
              patientType: patientType,
              createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            }
          : { createdAt: { $gte: startOfMonth, $lte: endOfMonth } },
      )
        .countDocuments()
        .exec();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getMaternityPatientRecordedThisYear(patientType = ''): Promise<number> {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    try {
      const patients = await this.MaternityRecordModel.find(
        Boolean(patientType) && patientType !== '0'
          ? { createdAt: { $gte: firstDayOfYear }, patientType: patientType }
          : { createdAt: { $gte: firstDayOfYear } },
      )
        .countDocuments()
        .exec();

      return patients;
    } catch (error) {
      console.log(error);
      throw new Error(`Unable to fetch patients: ${error.message}`);
    }
  }

  async countMaternityPatient(patientType = '') {
    try {
      return await this.MaternityRecordModel.find(
        Boolean(patientType) && patientType !== '0'
          ? { patientType: patientType }
          : {},
      ).countDocuments();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async findAllMaternityPatient(skip = 1, patientType = '') {
    if (!skip) {
      throw new UnauthorizedException('skip not provided');
    }
    try {
      const getpatients = await this.MaternityRecordModel.find(
        Boolean(patientType) && patientType !== '0'
          ? { patientType: patientType }
          : {},
      )
        .populate('MaternityRecordId')
        .skip((Number(skip) - 1) * 40)
        .limit(40)
        .sort({ createdAt: -1 });

      return getpatients;
    } catch (error) {
      console.log(error.message);
    }
  }

  async findPatientByDate(data: Date) {
    try {
      const startDate = new Date(data);
      const endDate = new Date(data);
      endDate.setDate(startDate.getDate() + 1);

      const find = await this.MaternityRecordModel.find({
        createdAt: { $gte: startDate, $lt: endDate },
      }).populate('patient');

      return find.map((element) => element.patient);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findPatientByName(nameSegment: string) {
    try {
      const find = this.MaternityRecordModel.find()
        .populate({
          path: 'patient',
          match: {
            fullName: { $regex: nameSegment.toUpperCase(), $options: 'i' },
          },
        })
        .exec();

      const filterPatient = (await find).map((element) => element.patient);

      return filterPatient.filter((element) => element !== null);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async createMaternityEmergencyAdministration({
    MaternityRecordId,
    administration,
    administrator,
    patientId,
  }: {
    MaternityRecordId: string;
    administration: maternityEmergencyRequest;
    administrator: string;
    patientId: string;
  }) {
    const maternityRecord =
      await this.MaternityRecordModel.findById(MaternityRecordId);

    if (maternityRecord.status === 'closed')
      throw new UnauthorizedException('Maternity case already closed');
    if (!maternityRecord)
      throw new NotFoundException('Maternity record not found');

    administration['administrator'] = administrator;
    maternityRecord.emergencyMedicinesAdministrations.push(administration);
    await maternityRecord.save();

    administration.medicines.forEach(async (element) => {
      await this.soldMedicineModel.create({
        medicineName: element.name,
        price: element.price,
        from: administrator,
        origin: 'Maternity',
        quantity: 1,
        patientId: patientId,
      });
    });

    return 'Record updated';
  }

  async updateDepositHistory(
    data: UpdateMaternityDepositHistoryDto,
    recordId: string,
  ) {
    const MaternityRecord = await this.MaternityRecordModel.findById(recordId);
    if (!MaternityRecord)
      throw new NotFoundException('Maternity record not found');

    MaternityRecord.depositHistory.push(data);
    await MaternityRecord.save();
  }

  async updatePackageAmount(
    data: UpdateMaternityPackageAmount,
    recordId: string,
  ) {
    const MaternityRecord = await this.MaternityRecordModel.findById(recordId);
    if (!MaternityRecord)
      throw new NotFoundException('Maternity record not found');

    if (data.amount < MaternityRecord.packageAmount) {
      throw new UnauthorizedException('Invalid amount');
    }

    MaternityRecord.packageAmount = data.amount;
    await MaternityRecord.save();
  }
}
