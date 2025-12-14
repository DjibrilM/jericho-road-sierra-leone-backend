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

import { AuthRequestPayload } from '../../hospitalization/hospitalization.controller';
import { MaternityRecordModel } from '../models/maternity-record.model';
import { ExamenPhysiqueRecordModel } from '../models/maternity-physical-examination.model';
import CreateExamenPhysiqueRecordDto from '../dto/create-examen-physique-record.dto';

@Injectable()
export class MaternityPhysicalExaminationService {
  constructor(
    @InjectModel(MaternityRecordModel.name)
    private maternityRecordModel: Model<MaternityRecordModel>,

    @InjectModel(ExamenPhysiqueRecordModel.name)
    private examenPhysiqueRecordModel: Model<ExamenPhysiqueRecordModel>,
  ) {}

  /** ---------------- Create ---------------- */
  async createExamenPhysiqueRecord(
    @Req() request: AuthRequestPayload,
    @Body() body: CreateExamenPhysiqueRecordDto,
  ) {
    const maternity = await this.maternityRecordModel.findById(body.record);
    if (!maternity) throw new BadRequestException();

    try {
      const data = await this.examenPhysiqueRecordModel.create({
        doctor: body.doctor,
        assistant: body.assistant,
        infirmiere: body.infirmiere,
        poids: body.poids,
        taille: body.taille,
        temperature: body.temperature,
        pouls: body.pouls,
        conjonctives: body.conjonctives,
        etatGeneral: body.etatGeneral,
        systemeRespiratoire: body.systemeRespiratoire,
        systemeCirculatoire: body.systemeCirculatoire,
        systemeDigestif: body.systemeDigestif,
        systemeUrinaire: body.systemeUrinaire,
        systemeLocomoteur: body.systemeLocomoteur,
        systemeNerveux: body.systemeNerveux,
        autre: body.autre,
        files: body.files,
        patient: body.patient,
        record: body.record,
        admnistrator: request.user.id,
      });

      if (!maternity.touched)
        await this.maternityRecordModel.findByIdAndUpdate(body.record, {
          touched: true,
        });

      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /** ---------------- Get by Id ---------------- */
  async getExamenPhysiqueRecordById(id: string) {
    try {
      return await this.examenPhysiqueRecordModel.findById(id).populate([
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
          path: 'admnistrator',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        },
      ]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /** ---------------- Get all for patient & record ---------------- */
  async getPatientExamenPhysiqueRecords(patient: string, record: string) {
    try {
      return await this.examenPhysiqueRecordModel
        .find({ patient, record })
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
            path: 'admnistrator',
            select:
              '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
          },
        ]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /** ---------------- Get all records for patient ---------------- */
  async getAllPatientExamenPhysiqueRecords(patient: string) {
    try {
      return await this.examenPhysiqueRecordModel.find({ patient }).populate([
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
          path: 'admnistrator',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        },
      ]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /** ---------------- Delete ---------------- */
  async deleteExamenPhysiqueRecord(id: string) {
    const find = await this.examenPhysiqueRecordModel.findById(id);
    if (!find) throw new NotFoundException();
    const createdAt = new Date(find.createdAt);
    const now = new Date();

    const diffInMs = +now - +createdAt; // correct order
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours >= 1) {
      throw new UnauthorizedException(
        'Impossible de supprimer un examen physique après une heure de création',
      );
    }

    return await this.examenPhysiqueRecordModel.findByIdAndDelete(id);
  }
}
