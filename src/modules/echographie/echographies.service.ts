// echographie.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Echographie, EchographieDocument } from './echographie.model';
import { CreateEchographieDto } from './echographies.dto'; // Changed from CreateRadiographieDto

@Injectable()
export class EchographieService {
  constructor(
    @InjectModel(Echographie.name)
    private echographieModel: Model<EchographieDocument>, // Changed from radiographieModel
  ) {}

  async create(
    createEchographieDto: CreateEchographieDto, // Changed from CreateRadiographieDto
  ): Promise<Echographie> {
    try {
      return await this.echographieModel.create({ ...createEchographieDto });
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Duplicate echographie entry'); // Changed from Duplicate radiographie entry
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(id: string): Promise<Echographie[]> {
    try {
      return await this.echographieModel // Changed from radiographieModel
        .find({ patient: id })
        .populate('doctor')
        .populate('patient')
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string): Promise<Echographie> {
    try {
      const echographie = await this.echographieModel.findById(id).exec(); // Changed from radiographieModel
      if (!echographie) {
        throw new NotFoundException(`Echographie with ID ${id} not found`); // Changed from Radiographie with ID
      }
      return echographie;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateEchographieDto: CreateEchographieDto, // Changed from CreateRadiographieDto
  ): Promise<Echographie> {
    try {
      const updatedEchographie = await this.echographieModel // Changed from radiographieModel
        .findByIdAndUpdate(id, updateEchographieDto, { new: true })
        .exec();

      if (!updatedEchographie) {
        throw new NotFoundException(`Echographie with ID ${id} not found`); // Changed from Radiographie with ID
      }

      return updatedEchographie;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<Echographie> {
    try {
      const deletedEchographie = await this.echographieModel // Changed from radiographieModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedEchographie) {
        throw new NotFoundException(`Echographie with ID ${id} not found`); // Changed from Radiographie with ID
      }

      return deletedEchographie;
    } catch (error) {
      throw error;
    }
  }
}
