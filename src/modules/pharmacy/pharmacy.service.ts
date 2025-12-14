import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Medecine } from './pharmacy.model';
import { SoldMedicineModel } from '../pharmacy/soldMedicine';
import { onSaleMedecin } from './onSalePharmacy.model';
import { InjectModel } from '@nestjs/mongoose';
import { HospitalizationMedecine } from './hospitalizationMedcines.model';

import {
  CreateMedecinDto,
  TakeMedecinFromGlobalStoreDto,
} from './pharmacy.dto';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectModel(Medecine.name) private medecinSchema: Model<Medecine>,
    @InjectModel(Medecine.name)
    private onSalemedecinSchema: Model<onSaleMedecin>,

    @InjectModel(HospitalizationMedecine.name)
    private hospitalizationMedecine: Model<HospitalizationMedecine>,

    @InjectModel(SoldMedicineModel.name)
    private soldMedicineModel: Model<SoldMedicineModel>,
  ) {}

  async createMedecin(data: CreateMedecinDto) {
    try {
      const create = await this.medecinSchema.create({
        ...data,
      });
      return create;
    } catch (error) {
      throw new InternalServerErrorException('failed to create medecin');
    }
  }

  //create on sale medecin(the following data is the stock of medecin that are ready to be sold)
  async createOnsaleMedecin(data: CreateMedecinDto) {
    try {
      const create = this.onSalemedecinSchema.create({ ...data });
      return create;
    } catch (error) {
      throw new InternalServerErrorException('faiiled to create');
    }
  }

  async takeMedecinFromGlobalStore(data: TakeMedecinFromGlobalStoreDto) {
    try {
      const find = await this.medecinSchema.findById(data.id);
      if (find.quantity < data.quanty) {
        throw new Error("dont't have enough medecines");
      }

      find.quantity = find.quantity - 1;
      if (find.quantity === 0) {
        //delete medecin once quantity is zero
        await this.medecinSchema.findByIdAndDelete(data.id);
      } else {
        find.save();
      }

      await this.onSalemedecinSchema.create({
        name: find.name,
        quantity: data.quanty,
        price: data.quanty,
      });

      return;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllMedecin() {
    try {
      const find = await this.medecinSchema
        .find()
        .sort({ createdAt: -1 })
        .exec();
      return find;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findOneMedecin(id: mongoose.Schema.Types.ObjectId) {
    try {
      const find = this.medecinSchema.findById(id);
      if (find) throw new Error('medecin not found');
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  //find all medecin within the on sale store
  async findAllOnSaleMedecin() {
    try {
      const find = await this.onSalemedecinSchema
        .find()
        .sort({ createdAt: -1 })
        .exec();
      return find;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //find one medecin within the on sale store
  async findOnSaleMedecin(id: mongoose.Schema.Types.ObjectId) {
    try {
      const find = this.onSalemedecinSchema.findById(id);
      if (find) throw new Error('medecin not found');
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async editMedecin(
    id: mongoose.Schema.Types.ObjectId,
    data: CreateMedecinDto,
  ) {
    try {
      const objectId = new mongoose.Types.ObjectId(id as any);
      const edit = this.medecinSchema.findByIdAndUpdate(
        objectId,
        { ...data },
        { new: true },
      );

      return edit;
    } catch (error) {
      throw new InternalServerErrorException('failed to edit the data');
    }
  }

  async editOnSaleMedecin(
    id: mongoose.Schema.Types.ObjectId,
    data: CreateMedecinDto,
  ) {
    try {
      const edit = this.medecinSchema.findByIdAndUpdate(
        id,
        { ...data },
        { new: true },
      );

      return edit;
    } catch (error) {
      throw new InternalServerErrorException('failed to edit the data');
    }
  }

  async sellFromGlobalStore(id: mongoose.Schema.Types.ObjectId) {
    try {
      const medcine = await this.medecinSchema.findById(id);
      if (!medcine) {
        throw new NotFoundException('Medcin No Found');
      }
      if (medcine.quantity > 1) {
        medcine.quantity = medcine.quantity - 1;
        await medcine.save();

        return 'sold';
      } else if (medcine.quantity <= 1) {
        await this.medecinSchema.findOneAndDelete(id);
        await medcine.save();

        return 'sold';
      }
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async deleteteFromGlobalStore(id: string) {
    try {
      if (!id) throw new BadRequestException();
      await this.medecinSchema.findByIdAndDelete(id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createHospitalizationMedicines(data: CreateMedecinDto) {
    return await this.hospitalizationMedecine.create(data);
  }

  async findHospitalizationMedicines() {
    const allMedicine = await this.medecinSchema
      .find()
      .sort({ createdAt: -1 })
      .exec();
    const hospitalizationMedicine = await this.hospitalizationMedecine
      .find()
      .sort({ createdAt: -1 });

    return [...hospitalizationMedicine, ...allMedicine];
  }

  async editHospitalizationMedicine(
    id: mongoose.Schema.Types.ObjectId,
    data: CreateMedecinDto,
  ) {
    try {
      const objectId = new mongoose.Types.ObjectId(id as any);
      const edit = this.hospitalizationMedecine.findByIdAndUpdate(
        objectId,
        { ...data },
        { new: true },
      );

      return edit;
    } catch (error) {
      throw new InternalServerErrorException('failed to edit the data');
    }
  }

  async deleteHospitalizationMedicine(id: string) {
    try {
      if (!id) throw new BadRequestException();
      await this.hospitalizationMedecine.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getSoldMedicineByDay({
    date,
    origin = '',
  }: {
    date: string;
    origin: string;
  }) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 0, 0);

    const filter = origin ? { origin } : {};


    const medicines = await this.soldMedicineModel
      .find({
         ...filter,
        createdAt: {
          $gte: startDate, // Greater than or equal to startDate
          $lt: endDate, // Less than endDate
        },
      })
      .populate('from')
      .populate('patientId');
    
    console.log({medicines})
    
    return medicines
  }
}
