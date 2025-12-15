import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateItemDto } from './dto/create-item.dto';
import { HistoryService } from '../history/history.service';
import { Item, ItemDocument } from './schemas/item.schema';
import { Category, CategoryDocument } from './schemas/categories.schema';
import { Types, TypesDocument } from './schemas/type.schema';

@Injectable()
export class ItemsService {
  private readonly MAX_LIMIT = 200;

  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,

    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,

    @InjectModel(Types.name)
    private readonly typesModel: Model<TypesDocument>,

    private readonly historyService: HistoryService,
  ) {}

  /** 🟢 Create an item */
  async create(dto: CreateItemDto): Promise<Item> {
    const item = await this.itemModel.create(dto);
    const findCategory = await this.categoryModel.findOne({
      name: dto.category,
    });

    const findType = await this.typesModel.findOne({
      name: dto.type.toLowerCase(),
    });

    if (!findType) {
      await this.typesModel.create({ name: dto.type.toLowerCase()});
    }
    if (!findCategory) {
      await this.categoryModel.create({ name: dto.category });
    }
    await this.historyService.log('Add', `Added ${dto.name}`, '', item.id);
    return item;
  }

  async findCategories(): Promise<CategoryDocument[]> {
    return this.categoryModel.find().sort({ name: 1 }).exec();
  }

  async findTypes(): Promise<TypesDocument[]> {
    return this.typesModel.find().sort({ name: 1 }).exec();
  }

  /** 🟡 Get all items with pagination */
  async findAll(
    page = 1,
    limit = 20,
    filters?: {
      search?: string;
      category?: string;
      type?: string;
      stock?: 'Expired' | 'Out of Stock';
    },
  ): Promise<{
    data: Item[];
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  }> {
    if (limit > this.MAX_LIMIT) {
      throw new BadRequestException(
        `Limit cannot exceed ${this.MAX_LIMIT} items per page`,
      );
    }

    const skip = (page - 1) * limit;

    // -----------------------------
    // Build dynamic MongoDB query
    // -----------------------------
    const query: any = {};

    if (filters) {
      const todayIso = new Date().toISOString().split('T')[0];

      // Search by name
      if (filters.search) {
        query.name = { $regex: filters.search, $options: 'i' }; // case-insensitive
      }

      // Filter by category
      if (filters.category && filters.category !== 'All') {
        query.category = filters.category;
      }

      // Filter by type
      if (filters.type && filters.type !== 'All') {
        query.type = filters.type;
      }

      // Filter by stock status
      if (filters.stock) {
        if (filters.stock === 'Expired') {
          query.expiry = { $lt: todayIso };
        } else if (filters.stock === 'Out of Stock') {
          query.quantity = { $lte: 0 };
        }
      }
    }

    // -----------------------------
    // Fetch items and count in parallel
    // -----------------------------
    const [data, total] = await Promise.all([
      this.itemModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.itemModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      totalPages,
      currentPage: page,
      perPage: limit,
    };
  }

  /** 🟣 Find one item */
  async findOne(id: string): Promise<ItemDocument> {
    const item = await this.itemModel.findById(id);
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  /** 🔵 Update item */
  async update(id: string, dto: CreateItemDto, reason: string): Promise<Item> {
    const item = await this.findOne(id);
    await this.historyService.log('Edit', `Edited ${item.name}`, reason, id);

    return this.itemModel.findByIdAndUpdate(id, dto);
  }

  /** 🟢 Increase quantity */
  async increase(id: string, amount: number, reason: string): Promise<Item> {
    const item = await this.findOne(id);
    item.quantity += amount;

    await item.save();
    await this.historyService.log(
      'Increase',
      `Increased ${item.name} by ${amount}`,
      reason,
      id,
    );
    return item;
  }

  /** 🔴 Decrease quantity */
  async decrease(id: string, amount: number, reason: string): Promise<Item> {
    const item = await this.findOne(id);
    const quantity = item.quantity - amount;

    item.quantity = quantity <= 0 ? 0 : quantity;

    await item.save();
    await this.historyService.log(
      'Decrease',
      `Decreased ${item.name} by ${amount}`,
      reason,
      id,
    );
    return item;
  }

  /** ⚫ Remove an item */
  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.itemModel.findByIdAndDelete(id);
    await this.historyService.log('Delete', `Deleted ${item.name}`, '', id);
  }
}
