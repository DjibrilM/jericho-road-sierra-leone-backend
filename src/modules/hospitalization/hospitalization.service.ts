import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import {
  CreateHopitalizationRecord,
  CreateHospitalizationRecommdationDto,
  CreateHospitalizationRecordPayamentDto,
  createDailySurverDto,
} from './hospitalization.dto';

import { HospitalizationPayementModel } from './hospitalizationPayment.model';
import { HospitalizationRecordModel } from './hospitalization.model';
import { DailyHospitalizationRecordModel } from './dailyRecord.model';
import { RecommandationModel } from './recommandation.modal';
import { SoldMedicineModel } from '../pharmacy/soldMedicine';
import { Patient } from '../patients/patient.model';

import { Medecine } from '../pharmacy/pharmacy.model';
import { hopsitalizationEmergencyRequest } from 'src/util/types';

@Injectable()
export class HospitalizationService {
  constructor(
    @InjectModel(Medecine.name) private medecinSchema: Model<Medecine>,
    @InjectModel(HospitalizationRecordModel.name)
    private HospitalizationRecordModel: Model<HospitalizationRecordModel>,

    @InjectModel(DailyHospitalizationRecordModel.name)
    private DailyHospitalizationRecord: Model<DailyHospitalizationRecordModel>,

    @InjectModel(HospitalizationPayementModel.name)
    private hospitalizationPayementModel: Model<HospitalizationPayementModel>,

    @InjectModel(Patient.name)
    private patientModal: Model<Patient>,

    @InjectModel(RecommandationModel.name)
    private recommandatioModal: Model<RecommandationModel>,

    @InjectModel(SoldMedicineModel.name)
    private soldMedicineModel: Model<SoldMedicineModel>,
  ) {}

  async createhopitalizatonRecord(data: CreateHopitalizationRecord) {
    return await this.HospitalizationRecordModel.create(data);
  }

  async getHopitalizationRecords(patient: string) {
    return await this.HospitalizationRecordModel.find({ patient })
      .populate('doctor')
      .sort({ createdAt: -1 });
  }

  async getHospitalizationRecordDetails(id: string) {
    try {
      const constructId = new mongoose.Types.ObjectId(id);
      const hospitaliationRecommandation =
        await this.recommandatioModal.findOne({
          hospitalizationRecord: constructId,
        });

      const hospitalizationRecord =
        await this.HospitalizationRecordModel.findOne({
          _id: constructId,
        })
          .populate('patient')
          .populate('doctor');

      const dailySurvey = await this.DailyHospitalizationRecord.find({
        hospitalizationRecord: constructId,
      }).populate('doctor');

      const getHospitalizationPayment =
        await this.hospitalizationPayementModel.findOne({
          HospitalizationRecordId: constructId,
        });

      return {
        hospitalizationRecord: hospitalizationRecord,
        dailySurvey,
        paymentTotalPrice: getHospitalizationPayment?.price || null,
        payement: getHospitalizationPayment,
        recommandation: hospitaliationRecommandation
          ? hospitaliationRecommandation['recommandation']
          : null,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createdailySurvey(data: createDailySurverDto) {
    const hospitalizationRecord =
      await this.HospitalizationRecordModel.findById(
        data.hospitalizationRecord,
      );

    if (hospitalizationRecord.status === 'closed') {
      throw new UnauthorizedException('Unauthorized action.');
    }

    //mark the hospitalization record as touched
    await this.HospitalizationRecordModel.findByIdAndUpdate(
      data.hospitalizationRecord,
      { touched: true },
    );

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

    return await this.DailyHospitalizationRecord.create({
      ...data,
      totalPrice: totalAmountServices + totalAmountMedicine,
    });
  }

  async updateDailySurvey(data: createDailySurverDto, id: string) {
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

    console.log({ totalAmountMedicine });

    const constructId = new mongoose.Types.ObjectId(id);
    const update = await this.DailyHospitalizationRecord.findOneAndUpdate(
      { _id: constructId },
      {
        ...data,
        totalPrice: totalAmountServices + totalAmountMedicine,
      },
    );

    return update;
  }

  async getHospitalizationRecordSurvey(id: string) {
    return await this.DailyHospitalizationRecord.find({
      hospitalizationRecord: id,
    })
      .populate('hospitalizationRecord')
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
    const survey = await this.DailyHospitalizationRecord.findById(id);

    switch (target) {
      case 'morningSurvery':
        survey['morningSurvery'].medicine.forEach(async (medicine) => {
          await this.soldMedicineModel.create({
            medicineName: medicine.name,
            price: medicine.price,
            from: survey.doctor,
            origin: 'hospitalization',
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
            origin: 'hospitalization',
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
            origin: 'hospitalization',
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

    const save = await this.DailyHospitalizationRecord.findOneAndUpdate(
      survey._id,
      {
        ...survey,
      },
    );

    save;
  }

  async updateHopsitalizationDiscount(id: string, discount: number) {
    return await this.HospitalizationRecordModel.findByIdAndUpdate(id, {
      discount: discount,
    });
  }

  async deleteHopitalizationRecordSurvey(id: string) {
    //check if already completed
    const findOne = await this.DailyHospitalizationRecord.findById(id);
    if (findOne.status === 'completed') {
      throw new UnauthorizedException('can not delete a completed record');
    }
    return await this.DailyHospitalizationRecord.findByIdAndDelete(id);
  }

  async createHospitalizationPayment(
    data: CreateHospitalizationRecordPayamentDto,
  ) {
    const hospitaliationRecommandation = await this.recommandatioModal.findOne({
      hospitalizationRecord: data.HospitalizationRecordId,
    });

    //close the hospitalization case
    const constructId = new mongoose.Types.ObjectId(
      data.HospitalizationRecordId,
    );
    const surveys = await this.DailyHospitalizationRecord.find({
      hospitalizationRecord: constructId,
    });

    const totalPrice = surveys.reduce(
      (acc, currentEl) => acc + currentEl.totalPrice,
      0,
    );

    await this.HospitalizationRecordModel.findByIdAndUpdate(
      data.HospitalizationRecordId,
      {
        status: 'closed',
      },
    );

    const patient = await this.patientModal.findById(data.patientId);

    const administratedEmergencyMedicinesTotalPrice = (
      await this.HospitalizationRecordModel.findById(
        data.HospitalizationRecordId,
      )
    ).imergencyMedicinesAdministrations
      .map((element) => element.medicines)
      .flat()
      .reduce((acc, currentElement) => acc + Number(currentElement.price), 0);

    return await this.hospitalizationPayementModel.create({
      ...data,
      price:
        totalPrice +
        administratedEmergencyMedicinesTotalPrice +
        (hospitaliationRecommandation?.totalPrice || 0),
      patientType: patient.patientType || '',
    });
  }

  private calaculateRecommandation(data: CreateHospitalizationRecommdationDto) {
    let recommandedMedicine = 0;
    const promise = new Promise((resol, __) => {
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
            resol(recommandedMedicine);
          }
        });
      }
    });

    return promise;
  }

  async createHospitalizationRecommandation(
    data: CreateHospitalizationRecommdationDto,
  ) {
    try {
      const checkIfAlreadyCreated = await this.recommandatioModal.findOne({
        hospitalizationRecord: data.hospitalizationRecord,
      });

      if (checkIfAlreadyCreated) {
        throw new ConflictException();
      }

      let recommandedMedicineTotalPrice =
        await this.calaculateRecommandation(data);
      const patient = new mongoose.Types.ObjectId(data.patient);
      const hospitalizationRecord = new mongoose.Types.ObjectId(
        data.hospitalizationRecord,
      );

      return await this.recommandatioModal.create({
        recommandation: data.recommandedMedicine,
        patient: patient,
        hospitalizationRecord: hospitalizationRecord,
        totalPrice: recommandedMedicineTotalPrice,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getHospitalizationPayments(skip: number) {
    try {
      const payments = await this.HospitalizationRecordModel.find()
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

  async deleteHospitalizationRecord(id: string) {
    const record = this.HospitalizationRecordModel.findById(id);
    if ((await record).touched) {
      throw new UnauthorizedException('Action not allowed');
    }
    return await this.HospitalizationRecordModel.findByIdAndDelete(id);
  }

  async findHospitalizationPatientsWithStaticstics() {
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

    const dailyPatient = await this.HospitalizationRecordModel.find({
      createdAt: { $gte: today },
    });
    const monthlyPayment = this.HospitalizationRecordModel.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const yearlyPayment = this.HospitalizationRecordModel.find({
      createdAt: { $gte: startOfYear, $lte: endOfYear },
    }).exec();

    return {
      dailyPatient,
      monthlyPayment,
      yearlyPayment,
    };
  }

  async getPatientPayments(patientId: string) {
    const constructId = new mongoose.Types.ObjectId(patientId);
    return this.hospitalizationPayementModel
      .find({ patientId })
      .populate('HospitalizationRecordId')
      .populate('senderId')
      .populate('patientId');
  }

  async getDayhospitalizationPayment(patientType = ''): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.hospitalizationPayementModel
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

  async geHospitalizationPaymentByDate(date: string) {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 0, 0);

      const find = await this.hospitalizationPayementModel
        .find({
          createdAt: {
            $gte: startDate, // Greater than or equal to startDate
            $lt: endDate, // Less than endDate
          },
        })
        .populate('senderId')
        .populate('patientId')
        .populate('HospitalizationRecordId');

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
      const getpatients = await this.hospitalizationPayementModel
        .find(
          Boolean(patientType) && patientType !== '0'
            ? { patientType: patientType }
            : {},
        )
        .populate('HospitalizationRecordId')
        .populate('senderId')
        .skip((Number(skip) - 1) * 40)
        .limit(40)
        .sort({ createdAt: -1 });

      return getpatients;
    } catch (error) {
      console.log(error.message);
    }
  }

  async getMonthHospitalizationPayment(patientType = ''): Promise<number> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1); // Set date to the first day of the month
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the next month
      endOfMonth.setDate(0); // Set date to the last day of the previous month
      endOfMonth.setHours(23, 59, 59, 999);

      return this.hospitalizationPayementModel
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

  async getHospitalizationPaymentRecordedThisYear(
    patientType = '',
  ): Promise<number> {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    try {
      const patients = await this.hospitalizationPayementModel
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

  async countHospitalizationPayment(patientType = '') {
    try {
      return await this.hospitalizationPayementModel
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

  async getDayhospitalizationPatient(patientType = ''): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.HospitalizationRecordModel.find(
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

  async findAllHospitalizationPatients(skip = 1, patientType = '') {
    if (!skip) {
      throw new UnauthorizedException('skip not provided');
    }
    try {
      const getpatients = await this.HospitalizationRecordModel.find(
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

  async getMonthHospitalizationPatient(patientType = ''): Promise<number> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1); // Set date to the first day of the month
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Move to the next month
      endOfMonth.setDate(0); // Set date to the last day of the previous month
      endOfMonth.setHours(23, 59, 59, 999);

      return this.HospitalizationRecordModel.find(
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

  async getHospitalizationPatientRecordedThisYear(
    patientType = '',
  ): Promise<number> {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    try {
      const patients = await this.HospitalizationRecordModel.find(
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

  async countHospitalizationPatient(patientType = '') {
    try {
      return await this.HospitalizationRecordModel.find(
        Boolean(patientType) && patientType !== '0'
          ? { patientType: patientType }
          : {},
      ).countDocuments();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async findAllHospitalizationPatient(skip = 1, patientType = '') {
    if (!skip) {
      throw new UnauthorizedException('skip not provided');
    }
    try {
      const getpatients = await this.HospitalizationRecordModel.find(
        Boolean(patientType) && patientType !== '0'
          ? { patientType: patientType }
          : {},
      )
        .populate('HospitalizationRecordId')
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

      const find = await this.HospitalizationRecordModel.find({
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
      const find = this.HospitalizationRecordModel.find()
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

  async createHospitalizationEmergencyAdministration({
    hospitalizationRecordId,
    admistration,
    administrator,
    patientId,
  }: {
    hospitalizationRecordId: string;
    admistration: hopsitalizationEmergencyRequest;
    administrator: string;
    patientId: string;
  }) {
    const hsopitalizationRecord =
      await this.HospitalizationRecordModel.findById(hospitalizationRecordId);

    if (hsopitalizationRecord.status === 'closed')
      throw new UnauthorizedException('Hospitalization case already closed');
    if (!hsopitalizationRecord)
      throw new NotFoundException('Hospitalization record not found');

    admistration['administrator'] = administrator;
    hsopitalizationRecord.imergencyMedicinesAdministrations.push(admistration);
    await hsopitalizationRecord.save();

    admistration.medicines.forEach(async (element) => {
      await this.soldMedicineModel.create({
        medicineName: element.name,
        price: element.price,
        from: administrator,
        origin: 'hospitalization',
        quantity: 1,
        patientId: patientId,
      });
    });

    return 'Record updated';
  }
}
