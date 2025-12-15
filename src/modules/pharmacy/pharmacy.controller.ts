import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  InternalServerErrorException,
  UseGuards,
  Query,
} from '@nestjs/common';

import { PharmacyService } from './pharmacy.service';
import { AuthGuard } from 'src/middlewares/auth.guard';

import {
  CreateMedecinDto,
  TakeMedecinFromGlobalStoreDto,
  sellGlobalStoreMedcineDto,
} from './pharmacy.dto';
import mongoose from 'mongoose';

@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Post('create-medecin')
  async createMedecin(@Body() body: CreateMedecinDto) {
    return this.pharmacyService.createMedecin(body);
  }

  @Delete('delete-global-store-medecin')
  async deleteFromGlobalStore() {}

  @Post('create-on-sale-medecin')
  async createOnsaleMedecin(@Body() body: CreateMedecinDto) {
    return this.pharmacyService.createOnsaleMedecin(body);
  }

  @Post('update-medecin/:id')
  updateMedecine(
    @Param() id: mongoose.Schema.Types.ObjectId,
    @Body() body: CreateMedecinDto,
  ) {
    return this.pharmacyService.editMedecin(id, body);
  }

  @Post('take-from-global-store')
  async takeMedecinFromGlobalStore(
    @Body() body: TakeMedecinFromGlobalStoreDto,
  ) {
    return this.pharmacyService.takeMedecinFromGlobalStore(body);
  }

  @Get('find-all-medcine')
  async findaLmedecin() {
    return this.pharmacyService.findAllMedecin();
  }

  @Get('find-all-on-sale-medecine')
  async findOnSaleMedecins() {
    return this.pharmacyService.findAllOnSaleMedecin();
  }

  @Get('find-on-sale-medecin/:id')
  async findOnSaleMedecin(@Param() id: mongoose.Schema.Types.ObjectId) {
    return this.pharmacyService.findOnSaleMedecin(id);
  }

  @Post('sell-globalStoreMedcine')
  async sellGlobalStoreMedcin(@Body() body: sellGlobalStoreMedcineDto) {
    return this.pharmacyService.sellFromGlobalStore(body.id);
  }

  @Delete('delete-medcine-from-global-store/:id')
  deleteMedcinFromGlobalStore(@Param('id') id: string) {
    try {
      return this.pharmacyService.deleteteFromGlobalStore(id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AuthGuard)
  @Post('create-hospitalization-medicine')
  async createHospitalizationMedicine(@Body() data: CreateMedecinDto) {
    return await this.pharmacyService.createHospitalizationMedicines(data);
  }

  @UseGuards(AuthGuard)
  @Get('find-hospitalization-medicine')
  async findHospitalizationMedecines() {
    return await this.pharmacyService.findHospitalizationMedicines();
  }

  @Post('update-hospitaliza-medecin/:id')
  updateHospitalizationMedicine(
    @Param() id: mongoose.Schema.Types.ObjectId,
    @Body() body: CreateMedecinDto,
  ) {
    return this.pharmacyService.editHospitalizationMedicine(id, body);
  }

  @Delete('delete-hospitalization-medicine/:id')
  deleteHospitalizationMedicine(@Param('id') id: string) {
    try {
      return this.pharmacyService.deleteHospitalizationMedicine(id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get('get-sold-medicie-by-date')
  async getSoldMedicine(
    @Query('origin') origin: string,
    @Query('date') date: string,
  ) {
    return await this.pharmacyService.getSoldMedicineByDay({ origin, date });
  }
}
