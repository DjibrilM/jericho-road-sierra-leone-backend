import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { RoleCheckGuard } from 'src/middlewares/RoleGuard.guard';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('pharmacy-stock')
@UseGuards(AuthGuard)
@UseGuards(RoleCheckGuard(['admin', 'pharmacy-stock-manager']))
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  /** 🟢 Create a new item */
  @Post()
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto);
  }

  /** 🟡 Fetch items with pagination & optional filters */
  @Get("list/all")
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '200',
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('stock') stock?: 'Expired' | 'Out of Stock',
  ) {
    const filters = { search, category, type, stock };
    return this.itemsService.findAll(+page, +limit, filters);
  }

  /** 🟣 Get a single item by ID */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  /** 🔵 Update an item */
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateItemDto) {
    const { dto, reason } = body;
    if (!id || !dto || !reason) {
      throw new BadRequestException(
        'Missing required fields: id, dto, or reason',
      );
    }
    return this.itemsService.update(id, dto, reason);
  }

  /** 🟢 Increase item quantity */
  @Post(':id/increase-quantity')
  increase(@Param('id') id: string, @Body() body: any) {
    return this.itemsService.increase(id, body.amount, body.reason);
  }

  /** 🔴 Decrease item quantity */
  @Post(':id/decrease-quantity')
  decrease(@Param('id') id: string, @Body() body: any) {
    return this.itemsService.decrease(id, body.amount, body.reason);
  }

  /** ⚫ Delete an item */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }

  /** 🟠 Fetch all categories */
  @Get('categories/list')
  findCategories() {
    return this.itemsService.findCategories();
  }

  /** 🟤 Fetch all types */
  @Get('types/list')
  findTypes() {
    return this.itemsService.findTypes();
  }
}
