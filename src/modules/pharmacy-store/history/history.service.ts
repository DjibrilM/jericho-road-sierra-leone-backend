import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History } from './schemas/history.schema';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name) private readonly historyModel: Model<History>,
  ) {}

  /** 🟢 Log an action into history */
  async log(action: string, details: string, reason: string, itemId: string) {
    await this.historyModel.create({ action, details, reason, itemId });
  }

  /** 🟡 Fetch the last 200 history entries (global) */
  async findAll(): Promise<History[]> {
    return this.historyModel
      .find()
      .sort({ createdAt: -1 }) // newest first
      .limit(1000)
      .exec();
  }

  async findByItem(
    itemId: string,
    filter: 'day' | 'week' | 'month' | 'all' = 'all',
    page = 1,
    limit = 100,
    date?: string,
  ): Promise<{ data: History[]; total: number; page: number }> {
    const baseDate = date ? new Date(date) : new Date();
    let startDate: Date | undefined;
    let endDate: Date | undefined;


    console.log("-----something")

    switch (filter) {
      case 'day':
        startDate = new Date(
          baseDate.getFullYear(),
          baseDate.getMonth(),
          baseDate.getDate(),
        );
        endDate = new Date(
          baseDate.getFullYear(),
          baseDate.getMonth(),
          baseDate.getDate() + 1,
        );
        break;

      case 'week': {
        const dayOfWeek = baseDate.getDay(); // Sunday = 0
        const diff =
          baseDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday start
        startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), diff);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
        break;
      }

      case 'month':
        startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
        endDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);
        break;

      case 'all':
      default:
        startDate = undefined;
        endDate = undefined;
    }

    const query: any = { itemId };
    if (startDate && endDate) {
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.historyModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.historyModel.countDocuments(query),
    ]);

    return { data, total, page };
  }
}
