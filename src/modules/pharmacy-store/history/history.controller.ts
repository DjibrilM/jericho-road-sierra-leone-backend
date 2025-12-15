import { Controller, Get, Param, Query } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  findAll() {
    return this.historyService.findAll();
  }

  @Get(':itemId')
  async findByItem(
    @Param('itemId') itemId: string,
    @Query('filter') filter?: 'day' | 'week' | 'month' | 'all',
    @Query('date') date?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    // Convert query params
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    return this.historyService.findByItem(
      itemId,
      filter,
      pageNum,
      limitNum,
      date,
    );
  }
}
