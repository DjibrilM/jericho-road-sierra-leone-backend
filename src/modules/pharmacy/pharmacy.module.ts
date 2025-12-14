import { Module } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { PharmacyController } from './pharmacy.controller';
import { Medecine, MedecinSchema } from './pharmacy.model';
import { onSaleMedecin, onsSaleMedecinSchema } from './onSalePharmacy.model';
import { MongooseModule } from '@nestjs/mongoose';
import { SoldMedicineModel, SoldMedecinSchema } from '../pharmacy/soldMedicine';
import { HospitalizationMedecinSchema,HospitalizationMedecine } from './hospitalizationMedcines.model';

@Module({
  providers: [PharmacyService],
  controllers: [PharmacyController],
  imports: [
    MongooseModule.forFeature([
      { name: SoldMedicineModel.name, schema: SoldMedecinSchema },
      { name: Medecine.name, schema: MedecinSchema },
      { name: onSaleMedecin.name, schema: onsSaleMedecinSchema },
      {
        name: HospitalizationMedecine.name,
        schema: HospitalizationMedecinSchema,
      },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: Medecine.name, schema: MedecinSchema },
      { name: onSaleMedecin.name, schema: onsSaleMedecinSchema },
      {
        name: HospitalizationMedecine.name,
        schema: HospitalizationMedecinSchema,
      },
    ]),
  ],
})
export class PharmacyModule {}
