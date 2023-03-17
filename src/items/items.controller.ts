import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Item } from './item.model';
import { ItemsService } from './items.service';
import { ItemStatus } from './item_status.enum';
import { CreateItemDTO } from './dto/create_item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly ItemsService: ItemsService) {}
  @Get()
  findAll(): Item[] {
    return this.ItemsService.findAll();
  }
  @Get(':id')
  findById(@Param('id') id: string): Item {
    return this.ItemsService.findById(id);
  }
  @Post()
  create(@Body() CreateItemDto: CreateItemDTO): Item {
    return this.ItemsService.create(CreateItemDto);
  }
  @Patch(':id')
  updateStatus(@Param('id') id: string): Item {
    return this.ItemsService.updateStatus(id);
  }
  @Delete(':id')
  delete(@Param('id') id: string): void {
    this.ItemsService.delateStatus(id);
  }
}
