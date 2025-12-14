// radiographie.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Radiographie, RadiographieDocument } from './radiographie.model';
import { CreateRadiographieDto } from './radiographies.dto';

@Injectable()
export class RadiographieService {
  constructor(
    @InjectModel(Radiographie.name)
    private radiographieModel: Model<RadiographieDocument>,
  ) {}

  async create(
    createRadiographieDto: CreateRadiographieDto,
  ): Promise<Radiographie> {
    try {
      const createdRadiographie = new this.radiographieModel(
        createRadiographieDto,
      );
      return await createdRadiographie.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Duplicate radiographie entry');
      }
      throw error;
    }
  }

  async findAll(id: string): Promise<Radiographie[]> {
    try {
      return await this.radiographieModel
        .find({ patient: id })
        .populate('doctor')
        .populate('patient')
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string): Promise<Radiographie> {
    try {
      const radiographie = await this.radiographieModel.findById(id).exec();
      if (!radiographie) {
        throw new NotFoundException(`Radiographie with ID ${id} not found`);
      }
      return radiographie;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateRadiographieDto: CreateRadiographieDto,
  ): Promise<Radiographie> {
    try {
      const updatedRadiographie = await this.radiographieModel
        .findByIdAndUpdate(id, updateRadiographieDto, { new: true })
        .exec();

      if (!updatedRadiographie) {
        throw new NotFoundException(`Radiographie with ID ${id} not found`);
      }

      return updatedRadiographie;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<Radiographie> {
    try {
      const deletedRadiographie = await this.radiographieModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedRadiographie) {
        throw new NotFoundException(`Radiographie with ID ${id} not found`);
      }

      return deletedRadiographie;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
