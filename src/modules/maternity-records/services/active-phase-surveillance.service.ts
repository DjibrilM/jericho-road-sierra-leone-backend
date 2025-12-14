import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ActivePhaseSurveillanceModel } from '../models/active-phase-surveillance.model';

import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { MaternityRecordModel } from '../models/maternity-record.model';
import { AuthRequestPayload } from 'src/util/types';
import createActivePhaseSurveillanceRecordDto from '../dto/ create-active-phase-surveillance.dto';

@Injectable()
export class ActivePhaseSurveillanceService {
  constructor(
    @InjectModel(ActivePhaseSurveillanceModel.name)
    private activePhaseSurveillanceModel: Model<ActivePhaseSurveillanceModel>,

    @InjectModel(MaternityRecordModel.name)
    private maternityRecordModel: Model<MaternityRecordModel>,
  ) {}

  async createActivePhaseSurveillanceServiceRecord(
    request: AuthRequestPayload,
    body: createActivePhaseSurveillanceRecordDto,
  ) {
    const maternity = await this.maternityRecordModel.findById(body.record);
    if (!maternity) throw new BadRequestException();

    try {
      const data = await this.activePhaseSurveillanceModel.create({
        doctor: body.doctor,
        assistant: body.assistant,
        explication: body.explication,
        files: body.files,
        infirmiere: body.infirmiere,
        patient: body.patient,
        meternityRecord: body.record,
        requestAuthor: request.user.id,
      });

      if (!maternity.touched)
        await this.maternityRecordModel.findByIdAndUpdate(body.record, {
          touched: true,
        });

      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getActivePhaseSurveillanceServiceRecordById(id: string) {
    try {
      return await this.activePhaseSurveillanceModel.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPatientActivePhaseSurveillanceServiceRecords({
    patient,
    materinityRecord,
  }: {
    patient: string;
    materinityRecord: string;
  }) {
    try {
      return await this.activePhaseSurveillanceModel
        .find({
          patient,
          meternityRecord: materinityRecord,
        })
        .populate({
          path: 'infirmiere',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        })
        .populate({
          path: 'patient',
        })
        .populate({
          path: 'doctor',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        })
        .populate({
          path: 'assistant',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        })
        .populate({
          path: 'requestAuthor',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllPatientActivePhaseSurveillanceServiceRecords(patient: string) {
    try {
      return await this.activePhaseSurveillanceModel
        .find({
          patient,
        })
        .populate({
          path: 'infirmiere',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        })
        .populate({
          path: 'patient',
        })
        .populate({
          path: 'doctor',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        })
        .populate({
          path: 'assistant',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteActivePhaseSurveillanceServiceRecords(id: string) {
    const find = await this.activePhaseSurveillanceModel.findById(id);
    if (!find) throw new NotFoundException();
    const createdAt = new Date(find.createdAt);
    const now = new Date();

    const diffInMs = +createdAt - +now; // difference in milliseconds
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours >= 1) {
      throw new UnauthorizedException(
        "Can't delete a record after one hour of creation",
      );
    }

    return await this.activePhaseSurveillanceModel.findByIdAndDelete(id);
  }
}
