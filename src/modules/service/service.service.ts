import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto, UpdateServiceDto } from './service.dto';
import { Service } from './service.model';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class HospitalServices {
  constructor(
    @InjectModel(Service.name) private serviceSchema: Model<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    try {
      const createServce = await this.serviceSchema.create({
        ...createServiceDto,
      });

      return createServce;
    } catch (error) {
      throw new InternalServerErrorException('failed to create service');
    }
  }

  async findAll() {
    try {
      const services = await this.serviceSchema
        .find()
        .sort({ createdAt: -1 })
        .exec();
      return services;
    } catch (error) {
      return new InternalServerErrorException('failed to load services');
    }
  }

  async findMedicalRecordSerives() {
    try {
      const services = await this.serviceSchema
        .find({ type: { $nin: ['hospitalization', 'laboratory'] } })
        .sort({ createdAt: -1 })
        .exec();
      return services;
    } catch (error) {
      return new InternalServerErrorException('failed to load services');
    }
  }

  async findHospitalizationRecord() {
    try {
      const services = await this.serviceSchema
        .find({ type: 'hospitalization' })
        .sort({ createdAt: -1 })
        .exec();
      return services;
    } catch (error) {
      return new InternalServerErrorException('failed to load services');
    }
  }

  async getEchographyServices() {
    try {
      const services = await this.serviceSchema
        .find({ type: 'echographie' })
        .sort({ createdAt: -1 })
        .exec();
      return services;
    } catch (error) {
      return new InternalServerErrorException('failed to load services');
    }
  }

  async getSurgeryServices() {
    try {
      const services = await this.serviceSchema
        .find({ type: 'surgery' })
        .sort({ createdAt: -1 })
        .exec();

      console.log(services);
      return services;
    } catch (error) {
      return new InternalServerErrorException('failed to load services');
    }
  }

  async getRadiographieServices() {
    try {
      const services = await this.serviceSchema
        .find({ type: 'radiographie' })
        .sort({ createdAt: -1 })
        .exec();
      return services;
    } catch (error) {
      return new InternalServerErrorException('failed to load services');
    }
  }

  async getAmabulatoryExaminationServices() {
    try {
      const services = await this.serviceSchema
        .find({ type: { $in: ['echographie', 'radiographie', 'laboratory'] } })
        .sort({ createdAt: -1 })
        .exec();

      return services;
    } catch (error) {
      return new InternalServerErrorException('failed to load services');
    }
  }

  async findOne(id: mongoose.Schema.Types.ObjectId) {
    try {
      const service = await this.serviceSchema.findById(id);
      return service;
    } catch (error) {
      return new NotFoundException('service not found');
    }
  }

  async update(
    id: mongoose.Schema.Types.ObjectId,
    updateServiceDto: UpdateServiceDto,
  ) {
    try {
      const updateService = await this.serviceSchema.findByIdAndUpdate(id, {
        ...updateServiceDto,
      });
      return updateService;
    } catch (error) {
      return new InternalServerErrorException('failed update service');
    }
  }

  async remove(id: mongoose.Schema.Types.ObjectId) {
    try {
      await this.serviceSchema.findByIdAndDelete(id);
      return 'service delete';
    } catch (error) {
      throw new InternalServerErrorException('failed to delete service');
    }
  }

  async findLaboratoryServices() {
    try {
      const find = await this.serviceSchema.find({
        type: 'laboratory',
      });

      return find;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findHospitalizationService() {
    return await this.serviceSchema.find({ type: 'hospitalization' });
  }

  async findMaternityLaboratoryServices() {
    return await this.serviceSchema.find({ type: 'maternity laboratory' });
  }
}
