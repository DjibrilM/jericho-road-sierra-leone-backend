import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { Item, ItemSchema } from './schemas/item.schema';
import { HistoryModule } from '../history/history.module';
import { Category, CategorySchema } from './schemas/categories.schema';
import { Types, TypesSchema } from './schemas/type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Types.name, schema: TypesSchema },
    ]),
    forwardRef(() => HistoryModule),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class PharmacyStoreModule {}
