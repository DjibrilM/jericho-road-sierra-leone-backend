import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TriagePediatric, TriageDocument } from './triage-pediatric.model';
import { CreateTriagePediatricDto } from './triage-pediatric.dto';

@Injectable()
export class TriagePediatricService {
  constructor(
    @InjectModel(TriagePediatric.name)
    private readonly triageModel: Model<TriageDocument>,
  ) {}

  /** Create a new Triage record */
  async create(createDto: CreateTriagePediatricDto): Promise<TriagePediatric> {
    const created = new this.triageModel(createDto);
    return created.save();
  }

  /** Get all Triage records */
  async findAll(): Promise<TriagePediatric[]> {
    return this.triageModel
      .find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'patientId',
      })
      .populate({
        path: 'author',
        select:
          '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
      })
      .populate({
        path: 'assistant',
        select:
          '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
      })
      .populate({
        path: 'maternityRecord',
      })

      .exec();
  }

  /** Get a single Triage record by ID */
  async findOne(id: string): Promise<TriagePediatric> {
    const triage = await this.triageModel
      .findById(id)
      .sort({ createdAt: -1 })
      .populate({
        path: 'patientId',
      })
      .populate({
        path: 'author',
        select:
          '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
      })
      .populate({
        path: 'assistant',
        select:
          '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
      })
      .populate({
        path: 'maternityRecord',
      })
      .exec();

    if (!triage)
      throw new NotFoundException(`Triage record with ID ${id} not found`);

    return triage;
  }

  /** Find all records by a specific user/author */
  async findByAuthor(authorId: string): Promise<TriagePediatric[]> {
    return this.triageModel
      .find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'patientId',
      })
      .populate({
        path: 'author',
        select:
          '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
      })
      .exec();
  }

  /** Find all records for a specific patient */
  async findByPatient(patientId: string): Promise<TriagePediatric[]> {
    return this.triageModel
      .find({ patientId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'patientId',
      })
      .populate({
        path: 'author',
        select:
          '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
      })
      .exec();
  }

  /** Find records based on arbitrary filter data */
  async findByData(
    filter: Partial<CreateTriagePediatricDto>,
  ): Promise<TriagePediatric[]> {
    return this.triageModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: 'patientId',
      })
      .populate({
        path: 'author',
        select:
          '-password -email -salary -faceReferenceImages -hasBiometrics -shift -role',
      })
      .exec();
  }

  /** Update a Triage record */
  async update(
    id: string,
    updateData: Partial<CreateTriagePediatricDto>,
  ): Promise<TriagePediatric> {
    const updated = await this.triageModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updated)
      throw new NotFoundException(`Triage record with ID ${id} not found`);

    return updated;
  }

  /** Delete a Triage record */
  async remove(id: string): Promise<{ success: boolean }> {
    const result = await this.triageModel.findByIdAndDelete(id).exec();

    if (!result)
      throw new NotFoundException(`Triage record with ID ${id} not found`);

    return { success: true };
  }
}
