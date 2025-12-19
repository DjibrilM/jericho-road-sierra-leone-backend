import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import {
  CreateSurgeryRecommendationDto,
  CreateSurgeryRecord,
  CreateSurgeryRecordPaymentDto,
  UpdateSurgeryDepositHistoryDto,
  UpdateSurgeryPackageAmount,
  createDailySurveyDto,
} from './surgery';

import { SurgeryPaymentModel } from './surgeryPayment.model';
import { SurgeryRecordModel } from './surgery.model';
import { DailySurgeryRecordModel } from './dailyRecord.model';
import { RecommandationModel } from './recommandation.modal';
import { SoldMedicineModel } from '../pharmacy/soldMedicine';
import { Patient } from '../patients/patient.model';

import { Medecine } from '../pharmacy/pharmacy.model';
import { hopsitalizationEmergencyRequest } from 'src/util/types';

@Injectable()
export class SurgeryService {
  constructor(
    @InjectModel(Medecine.name) private medecinSchema: Model<Medecine>,
    @InjectModel(SurgeryRecordModel.name)
    private SurgeryRecordModel: Model<SurgeryRecordModel>,

    @InjectModel(DailySurgeryRecordModel.name)
    private DailySurgeryRecord: Model<DailySurgeryRecordModel>,

    @InjectModel(SurgeryPaymentModel.name)
    private SurgeryPaymentModel: Model<SurgeryPaymentModel>,

    @InjectModel(Patient.name)
    private patientModal: Model<Patient>,

    @InjectModel(RecommandationModel.name)
    private recommandatioModal: Model<RecommandationModel>,

    @InjectModel(SoldMedicineModel.name)
    private soldMedicineModel: Model<SoldMedicineModel>,
  ) {}

  async createSurgeryRecord(data: CreateSurgeryRecord) {
    return await this.SurgeryRecordModel.create(data);
  }

  async getSurgeryRecords(patient: string) {
    return await this.SurgeryRecordModel.find({ patient })
      .populate('doctor')
      .sort({ createdAt: -1 });
  }

  async getSurgeryRecordDetails(id: string) {
    try {
      const constructId = new mongoose.Types.ObjectId(id);
      const hospitaliationRecommandation =
        await this.recommandatioModal.findOne({
          SurgeryRecord: constructId,
        });

      const SurgeryRecord = await this.SurgeryRecordModel.findOne({
        _id: constructId,
      })
        .populate('patient')
        .populate('doctor');

      const dailySurvey = await this.DailySurgeryRecord.find({
        surgeryRecord: constructId,
      }).populate('doctor');

      const getSurgeryPayment = await this.SurgeryPaymentModel.findOne({
        SurgeryRecordId: constructId,
      });

      return {
        SurgeryRecord: SurgeryRecord,
        dailySurvey,
        paymentTotalPrice: getSurgeryPayment?.price || null,
        payement: getSurgeryPayment,
        recommandation: hospitaliationRecommandation
          ? hospitaliationRecommandation['recommandation']
          : null,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createDailySurvey(data: createDailySurveyDto) {
    const SurgeryRecord = await this.SurgeryRecordModel.findById(
      data.SurgeryRecord,
    );

    if (SurgeryRecord.status === 'closed') {
      throw new UnauthorizedException('Unauthorized action.');
    }

    //mark the Surgery record as touched
    await this.SurgeryRecordModel.findByIdAndUpdate(data.SurgeryRecord, {
      touched: true,
    });

    const totalAmountServices =
      data.morningSurvery['service'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      ) +
      data.afternoonSurvery['service'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      ) +
      data.eveningSurvery['service'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      );

    const totalAmountMedicine =
      data.morningSurvery['medicine'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      ) +
      data.afternoonSurvery['medicine'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      ) +
      data.eveningSurvery['medicine'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      );

    return await this.DailySurgeryRecord.create({
      ...data,
      surgeryRecord: data.SurgeryRecord,
      totalPrice: totalAmountServices + totalAmountMedicine,
    });
  }

  async updateDailySurvey(data: createDailySurveyDto, id: string) {
    const totalAmountServices =
      data.morningSurvery['service'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      ) +
      data.afternoonSurvery['service'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      ) +
      data.eveningSurvery['service'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      );

    const totalAmountMedicine =
      data.morningSurvery['medicine'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      ) +
      data.afternoonSurvery['medicine'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      ) +
      data.eveningSurvery['medicine'].reduce(
        (ac: number, el: Medecine) => ac + Number(el.price),
        0,
      );

    const constructId = new mongoose.Types.ObjectId(id);
    const update = await this.DailySurgeryRecord.findOneAndUpdate(
      { _id: constructId },
      {
        ...data,
        surgeryRecord: data.SurgeryRecord,
        totalPrice: totalAmountServices + totalAmountMedicine,
      },
    );

    return update;
  }

  async getSurgeryRecordSurvey(id: string) {
    return await this.DailySurgeryRecord.find({
      surgeryRecord: id,
    })
      .populate('surgeryRecord')
      .populate('doctor')
      .populate('patient')
      .sort({ createdAt: -1 });
  }

  async markSurveyAsCompled({
    id,
    target,
  }: {
    target: 'eveningSurvery' | 'morningSurvery' | 'afternoonSurvery';
    id: string;
  }) {
    const survey = await this.DailySurgeryRecord.findById(id);

    switch (target) {
      case 'morningSurvery':
        survey['morningSurvery'].medicine.forEach(async (medicine) => {
          await this.soldMedicineModel.create({
            medicineName: medicine.name,
            price: medicine.price,
            from: survey.doctor,
            origin: 'Surgery',
            quantity: 1,
            patientId: survey.patient,
          });
        });

        survey.morningSurvery.status = 'completed';
        break;
      case 'eveningSurvery':
        survey['eveningSurvery'].medicine.forEach(async (medicine) => {
          await this.soldMedicineModel.create({
            medicineName: medicine.name,
            price: medicine.price,
            from: survey.doctor,
            origin: 'Surgery',
            quantity: 1,
            patientId: survey.patient,
          });
        });
        survey.eveningSurvery.status = 'completed';
        break;
      case 'afternoonSurvery':
        survey['afternoonSurvery'].medicine.forEach(async (medicine) => {
          await this.soldMedicineModel.create({
            medicineName: medicine.name,
            price: medicine.price,
            from: survey.doctor,
            origin: 'Surgery',
            quantity: 1,
            patientId: survey.patient,
          });
        });
        survey.afternoonSurvery.status = 'completed';
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

    const save = await this.DailySurgeryRecord.findOneAndUpdate(survey._id, {
      ...survey,
    });

    save;
  }

  async updateHopsitalizationDiscount(id: string, discount: number) {
    return await this.SurgeryRecordModel.findByIdAndUpdate(id, {
      discount: discount,
    });
  }

  async deleteSurgeryRecordSurvey(id: string) {
    //check if already completed
    const findOne = await this.DailySurgeryRecord.findById(id);
    if (findOne.status === 'completed') {
      throw new UnauthorizedException('can not delete a completed record');
    }
    return await this.DailySurgeryRecord.findByIdAndDelete(id);
  }

  async createSurgeryPayment(data: CreateSurgeryRecordPaymentDto) {
    const SurgeryRecord = await this.SurgeryRecordModel.findById(
      data.SurgeryRecordId,
    );

    const hospitaliationRecommandation = await this.recommandatioModal.findOne({
      SurgeryRecord: data.SurgeryRecordId,
    });

    //close the Surgery case
    const constructId = new mongoose.Types.ObjectId(data.SurgeryRecordId);
    const surveys = await this.DailySurgeryRecord.find({
      SurgeryRecord: constructId,
    });

    const totalPrice = surveys.reduce(
      (acc, currentEl) => acc + currentEl.totalPrice,
      0,
    );

    await this.SurgeryRecordModel.findByIdAndUpdate(data.SurgeryRecordId, {
      status: 'closed',
    });

    const patient = await this.patientModal.findById(data.patientId);

    const administratedEmergencyMedicinesTotalPrice = (
      await this.SurgeryRecordModel.findById(data.SurgeryRecordId)
    ).imergencyMedicinesAdministrations
      .map((element) => element.medicines)
      .flat()
      .reduce((acc, currentElement) => acc + Number(currentElement.price), 0);

    return await this.SurgeryPaymentModel.create({
      ...data,
      totalSpending:
        totalPrice +
        administratedEmergencyMedicinesTotalPrice +
        (hospitaliationRecommandation?.totalPrice || 0),
      patientType: patient.patientType || '',
      price: SurgeryRecord.packageAmount,
    });
  }

  private calaculateRecommandation(data: CreateSurgeryRecommendationDto) {
    let recommandedMedicine = 0;
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
          recommandedMedicine +=
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
            resolve(recommandedMedicine);
          }
        });
      }
    });

    return promise;
  }

  async createSurgeryRecommendation(data: CreateSurgeryRecommendationDto) {
    try {
      const checkIfAlreadyCreated = await this.recommandatioModal.findOne({
        SurgeryRecord: data.SurgeryRecord,
      });

      if (checkIfAlreadyCreated) {
        throw new ConflictException();
      }

      const recommandedMedicineTotalPrice =
        await this.calaculateRecommandation(data);
      const patient = new mongoose.Types.ObjectId(data.patient);
      const SurgeryRecord = new mongoose.Types.ObjectId(data.SurgeryRecord);

      return await this.recommandatioModal.create({
        recommandation: data.recommandedMedicine,
        patient: patient,
        SurgeryRecord: SurgeryRecord,
        totalPrice: recommandedMedicineTotalPrice,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getSurgeryPayments(skip: number) {
    try {
      const payments = await this.SurgeryRecordModel.find()
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

  async deleteSurgeryRecord(id: string) {
    const record = this.SurgeryRecordModel.findById(id);
    if ((await record).touched) {
      throw new UnauthorizedException('Action not allowed');
    }
    return await this.SurgeryRecordModel.findByIdAndDelete(id);
  }

  async findSurgeryPatientsWithStaticstics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1); // Set date to the first day of the month
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the next month
    endOfMonth.setDate(0); // Set date to the last day of the previous month
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

    const dailyPatient = await this.SurgeryRecordModel.find({
      createdAt: { $gte: today },
    });
    const monthlyPayment = this.SurgeryRecordModel.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const yearlyPayment = this.SurgeryRecordModel.find({
      createdAt: { $gte: startOfYear, $lte: endOfYear },
    }).exec();

    return {
      dailyPatient,
      monthlyPayment,
      yearlyPayment,
    };
  }

  async getPatientPayments(patientId: string) {
    return this.SurgeryPaymentModel.find({ patientId })
      .populate('SurgeryRecordId')
      .populate('senderId')
      .populate('patientId');
  }

  async getDaySurgeryPayment(patientType = ''): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.SurgeryPaymentModel.find(
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

  async geSurgeryPaymentByDate(date: string) {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 0, 0);

      const find = await this.SurgeryPaymentModel.find({
        createdAt: {
          $gte: startDate, // Greater than or equal to startDate
          $lt: endDate, // Less than endDate
        },
      })
        .populate('senderId')
        .populate('patientId')
        .populate('SurgeryRecordId');

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

  async findAllPayment(skip: number, patientType = '') {
    if (!skip) {
      throw new UnauthorizedException('skip not provided');
    }
    try {
      const getpatients = await this.SurgeryPaymentModel.find(
        Boolean(patientType) && patientType !== '0'
          ? { patientType: patientType }
          : {},
      )
        .populate('SurgeryRecordId')
        .populate('senderId')
        .skip((Number(skip) - 1) * 40)
        .limit(40)
        .sort({ createdAt: -1 });

      return getpatients;
    } catch (error) {
      console.log(error.message);
    }
  }

  async getMonthSurgeryPayment(patientType = ''): Promise<number> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1); // Set date to the first day of the month
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the next month
      endOfMonth.setDate(0); // Set date to the last day of the previous month
      endOfMonth.setHours(23, 59, 59, 999);

      return this.SurgeryPaymentModel.find(
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

  async getSurgeryPaymentRecordedThisYear(patientType = ''): Promise<number> {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    try {
      const patients = await this.SurgeryPaymentModel.find(
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

  async countSurgeryPayment(patientType = '') {
    try {
      return await this.SurgeryPaymentModel.find(
        Boolean(patientType) && patientType !== '0'
          ? { patientType: patientType }
          : {},
      ).countDocuments();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async getDaySurgeryPatient(patientType = ''): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.SurgeryRecordModel.find(
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

  async findAllSurgeryPatients(skip = 1, patientType = '') {
    if (!skip) {
      throw new UnauthorizedException('skip not provided');
    }
    try {
      const getpatients = await this.SurgeryRecordModel.find(
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

  async getMonthSurgeryPatient(patientType = ''): Promise<number> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1); // Set date to the first day of the month
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the next month
      endOfMonth.setDate(0); // Set date to the last day of the previous month
      endOfMonth.setHours(23, 59, 59, 999);

      return this.SurgeryRecordModel.find(
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

  async getSurgeryPatientRecordedThisYear(patientType = ''): Promise<number> {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    try {
      const patients = await this.SurgeryRecordModel.find(
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

  async countSurgeryPatient(patientType = '') {
    try {
      return await this.SurgeryRecordModel.find(
        Boolean(patientType) && patientType !== '0'
          ? { patientType: patientType }
          : {},
      ).countDocuments();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async findAllSurgeryPatient(skip = 1, patientType = '') {
    if (!skip) {
      throw new UnauthorizedException('skip not provided');
    }
    try {
      const getpatients = await this.SurgeryRecordModel.find(
        Boolean(patientType) && patientType !== '0'
          ? { patientType: patientType }
          : {},
      )
        .populate('SurgeryRecordId')
        .skip((Number(skip) - 1) * 40)
        .limit(40)
        .sort({ createdAt: -1 });

      return getpatients;
    } catch (error) {
      console.log(error.message);
    }
  }

  async fingPatientByDate(data: Date) {
    try {
      const startDate = new Date(data);
      const endDate = new Date(data);
      endDate.setDate(startDate.getDate() + 1);

      const find = await this.SurgeryRecordModel.find({
        createdAt: {
          $gte: startDate, // Greater than or equal to startDate
          $lt: endDate, // Less than endDate
        },
      }).populate('patient');

      return find.map((element) => element.patient);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findPatientByName(nameSegment: string) {
    try {
      const find = this.SurgeryRecordModel.find()
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

  async createSurgeryEmergencyAdministration({
    SurgeryRecordId,
    admistration,
    administrator,
    patientId,
  }: {
    SurgeryRecordId: string;
    admistration: hopsitalizationEmergencyRequest;
    administrator: string;
    patientId: string;
  }) {
    const hsopitalizationRecord =
      await this.SurgeryRecordModel.findById(SurgeryRecordId);

    if (hsopitalizationRecord.status === 'closed')
      throw new UnauthorizedException('Surgery case already closed');
    if (!hsopitalizationRecord)
      throw new NotFoundException('Surgery record not found');

    admistration['administrator'] = administrator;
    hsopitalizationRecord.imergencyMedicinesAdministrations.push(admistration);
    await hsopitalizationRecord.save();

    admistration.medicines.forEach(async (element) => {
      await this.soldMedicineModel.create({
        medicineName: element.name,
        price: element.price,
        from: administrator,
        origin: 'Surgery',
        quantity: 1,
        patientId: patientId,
      });
    });

    return 'Record updated';
  }

  async updateDepositHistory(
    data: UpdateSurgeryDepositHistoryDto,
    recordId: string,
  ) {
    console.log(recordId);
    console.log(await this.SurgeryRecordModel.find(), 'record');
    const SurgeryRecord = await this.SurgeryRecordModel.findById(recordId);
    console.log(SurgeryRecord);

    if (!SurgeryRecord) throw new NotFoundException('Surgery record not found');

    SurgeryRecord.depositHistory.push(data);

    await SurgeryRecord.save();
  }

  async updatePackageAmount(
    data: UpdateSurgeryPackageAmount,
    recordId: string,
  ) {
    const SurgeryRecord = await this.SurgeryRecordModel.findById(recordId);

    if (!SurgeryRecord) throw new NotFoundException('Surgery record not found');

    if (data.amount < SurgeryRecord.packageAmount) {
      throw new UnauthorizedException('Invalid amount');
    }

    SurgeryRecord.packageAmount = data.amount;

    await SurgeryRecord.save();
  }
}
