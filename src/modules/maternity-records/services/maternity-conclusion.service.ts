import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthRequestPayload } from '../../hospitalization/hospitalization.controller';
import {
  ConclusionRecordDocument,
  ConclusionRecordModel,
} from '../models/maternity-conclusion.model';
import { CreateConclusionRecordDto } from '../dto/create-conclusion-record.dto';

@Injectable()
export class ConclusionRecordService {
  constructor(
    @InjectModel(ConclusionRecordModel.name)
    private readonly conclusionModel: Model<ConclusionRecordDocument>,
  ) {}

  // Create a conclusion record
  async create(
    @Req() request: AuthRequestPayload,
    createDto: CreateConclusionRecordDto,
  ): Promise<ConclusionRecordDocument> {
    try {
      const record = await this.conclusionModel.create({
        ...createDto,
        requestAuthor: request.user.id,
      });
      return record;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Get a single conclusion record by ID
  async findOne(id: string): Promise<ConclusionRecordDocument> {
    try {
      const record = await this.conclusionModel
        .findById(id)
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
          path: 'infirmiere',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        })
        .populate({
          path: 'requestAuthor',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        })
        .populate({
          path: 'maternityRecord',
        })
        .exec();

      if (!record) throw new NotFoundException('Conclusion record not found');
      return record;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Get all conclusion records for a patient
  async findAllByPatient(
    patientId: string,
  ): Promise<ConclusionRecordDocument[]> {
    try {
      return await this.conclusionModel
        .find({ patient: patientId })
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
          path: 'infirmiere',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        })
        .populate({
          path: 'requestAuthor',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        })
        .populate({
          path: 'maternityRecord',
        })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // Delete a conclusion record
  async remove(id: string): Promise<{ deleted: boolean }> {
    const record = await this.conclusionModel.findById(id);
    if (!record) throw new NotFoundException('Conclusion record not found');

    const createdAt = new Date(record.createdAt);
    const now = new Date();
    const diffInMs = now.getTime() - createdAt.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours >= 1) {
      throw new UnauthorizedException(
        "Can't delete a record after one hour of creation",
      );
    }

    await this.conclusionModel.findByIdAndDelete(id).exec();
    return { deleted: true };
  }

  // Get latest conclusion for a patient
  async findLatestByPatient(
    patientId: string,
  ): Promise<ConclusionRecordDocument> {
    try {
      const record = await this.conclusionModel
        .findOne({ patient: patientId })
        .sort({ createdAt: -1 })
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
          path: 'infirmiere',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        })
        .populate({
          path: 'requestAuthor',
          select:
            '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
        })
        .populate({
          path: 'maternityRecord',
        })
        .exec();

      if (!record)
        throw new NotFoundException(
          'No conclusion record found for this patient',
        );
      return record;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
