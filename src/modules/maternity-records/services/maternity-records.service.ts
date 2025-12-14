import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import CreateMaternityRecordDto from '../dto/create-maternity-record.dto';
import { MaternityRecordModel } from '../models/maternity-record.model';
import { AuthRequestPayload } from '../../hospitalization/hospitalization.controller';
import createPartogrammeRecordDto from '../dto/create-partogramme-record.dto';
import { PartogrammeRecordModel } from '../models/partogramme-record.model';

@Injectable()
export class MaternityRecordsService {
  constructor(
    @InjectModel(MaternityRecordModel.name)
    private maternityRecordModel: Model<MaternityRecordModel>,

    @InjectModel(PartogrammeRecordModel.name)
    private PartogrammeRecordModel: Model<PartogrammeRecordModel>,
  ) {}

  async create(
    createMaternityRecordDto: CreateMaternityRecordDto,
    administrator: string,
  ) {
    try {
      return await this.maternityRecordModel.create({
        SurveillanceDeLaPhaseDeLatence4cm:
          createMaternityRecordDto.SurveillanceDeLaPhaseDeLatence4cm,
        patient: createMaternityRecordDto.patient,
        plaintes: createMaternityRecordDto.plaintes,
        accouchement: createMaternityRecordDto.accouchement,
        admission: createMaternityRecordDto.admission,
        surveillancePhaseActiveGte4cm:
          createMaternityRecordDto.surveillancePhaseActiveGte4cm,
        surveillancePostPartumImmediatEtTardif:
          createMaternityRecordDto.surveillancePostPartumImmediatEtTardif,
        administrator,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findUserAll(id: string) {
    try {
      return await this.maternityRecordModel
        .find({ patient: id })
        .populate({
          path: 'administrator',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createPartogrammeRecord(
    @Req() request: AuthRequestPayload,
    @Body() body: createPartogrammeRecordDto,
  ) {
    const maternity = await this.maternityRecordModel.findById(body.record);
    if (!maternity) throw new BadRequestException();

    try {
      const data = await this.PartogrammeRecordModel.create({
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

  async getPartogrammeRecordById(id: string) {
    try {
      return await this.PartogrammeRecordModel.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPatientPartogrammeRecords({
    patient,
    materinityRecord,
  }: {
    patient: string;
    materinityRecord: string;
  }) {
    try {
      return await this.PartogrammeRecordModel.find({
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

  async getAllPatientPartogrammeRecords(patient: string) {
    try {
      return await this.PartogrammeRecordModel.find({
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

  async deletePartogrammeRecords(id: string) {
    const find = await this.PartogrammeRecordModel.findById(id);
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

    return await this.PartogrammeRecordModel.findByIdAndDelete(id);
  }

  async deleteMaternityRecord(id: string) {
    const record = await this.maternityRecordModel.findById(id);
    if (!record.touched)
      return await this.maternityRecordModel.findByIdAndDelete();
    else throw new BadRequestException("This record can't be deleted");
  }
}
