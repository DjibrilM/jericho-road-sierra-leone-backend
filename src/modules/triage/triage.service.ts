import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTriageDto } from './triage.dto';
import { Triage, TriageDocument } from './triage.model';
import { GeneralWebsocketGateway } from 'src/websocket.gateway';
import { Patient } from 'src/modules/patients/patient.model';
import {
  AptitudePhysique,
  AptitudePhysiqueDocument,
} from './aptitudePhysique.modal';

@Injectable()
export class TriageService {
  constructor(
    @InjectModel(Triage.name)
    private readonly triageModel: Model<TriageDocument>,
    @InjectModel(AptitudePhysique.name)
    private readonly aptitudePhysiqueModel: Model<AptitudePhysiqueDocument>,
    private readonly websocketGateway: GeneralWebsocketGateway,
    @InjectModel(Patient.name) private patienSchema: Model<Patient>,
  ) {}

  async createTriage(createTriageDto: CreateTriageDto): Promise<Triage> {
    try {
      const createdTriage = await this.triageModel.create(createTriageDto);
      const patient = this.patienSchema.findById(createTriageDto.patientId);

      if (createTriageDto.aptitudePhysique) {
        await this.aptitudePhysiqueModel.create({
          doctor: createTriageDto.doctor,
          patient: createTriageDto.patientId,
        });
      }

      return createdTriage.save();
    } catch (error) {
      // Handle the error appropriately (e.g., log, notify administrators)
      console.error('Error creating triage:', error.message);
      throw new Error('Failed to create triage');
    }
  }

  async getTriageById(triageId: string): Promise<Triage> {
    try {
      const triage = await this.triageModel
        .findById(triageId)
        .populate('doctor');
      if (!triage) {
        throw new NotFoundException('Triage not found');
      }
      return triage;
    } catch (error) {
      // Handle the error appropriately (e.g., log, notify administrators)
      console.error('Error fetching triage by ID:', error.message);
      throw new Error('Failed to fetch triage by ID');
    }
  }

  async getAllTriage(
    clientId: mongoose.Schema.Types.ObjectId,
  ): Promise<Triage[]> {
    if (!clientId)
      throw new UnauthorizedException('Client ID must be prpvided');

    try {
      return await this.triageModel
        .find({ patientId: clientId })
        .populate('doctor')
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      // Handle the error appropriately (e.g., log, notify administrators)
      console.error('Error fetching all triages:', error.message);
      throw new Error('Failed to fetch all triages');
    }
  }

  async deleteTriage(triageId: string): Promise<void> {
    try {
      const deletedTriage = await this.triageModel
        .findByIdAndDelete(triageId)
        .exec();
      if (!deletedTriage) {
        throw new NotFoundException('Triage not found');
      }
    } catch (error) {
      // Handle the error appropriately (e.g., log, notify administrators)
      console.error('Error deleting triage:', error.message);
      throw new Error('Failed to delete triage');
    }
  }

  async getAptitudePhysiqueByDate(date: string) {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 0, 0);

      const find = await this.aptitudePhysiqueModel
        .find({
          createdAt: {
            $gte: startDate, // Greater than or equal to startDate
            $lt: endDate, // Less than endDate
          },
        })
        .populate('doctor')
        .populate('patient');

      return find;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getAptitudePhysiqueForPatient(patientId: string) {
    return await this.aptitudePhysiqueModel
      .find({
        patient: patientId,
      })
      .populate('doctor')
      .populate('patient');
  }

  async getAptitudePhysiquePaymentByDate(date: string) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 0, 0);

    const find = await this.aptitudePhysiqueModel
      .find({
        payed: true,
        createdAt: {
          $gte: startDate, // Greater than or equal to startDate
          $lt: endDate, // Less than endDate
        },
      })
      .populate('doctor')
      .populate('patient');

    return find;
  }

  async getAptitudePhysiquePaymentForPatient(patientId: string) {
    return await this.aptitudePhysiqueModel
      .find({
        payed: true,
        patient: patientId,
      })
      .populate('doctor')
      .populate('patient');
  }

  async createAptitudephysiquePayment(id: string) {
    try {
      await this.aptitudePhysiqueModel.findByIdAndUpdate(id, { payed: true });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
