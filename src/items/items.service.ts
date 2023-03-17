import { Injectable } from '@nestjs/common';
import { Item } from './item.model';
import { ItemStatus } from './item_status.enum';
import { CreateItemDTO } from './dto/create_item.dto';

@Injectable()
export class ItemsService {
  private items: Item[] = [];
  findAll() {
    return this.items;
  }
  findById(id: string): Item {
    return this.items.find((item) => item.id === id);
  }
  create(CreateItemDTO: CreateItemDTO): Item {
    const item: Item = {
      ...CreateItemDTO,
      status: ItemStatus.ON_SALE,
    };
    this.items.push(item);
    return item;
  }
  updateStatus(id: string): Item {
    const item = this.findById(id);
    item.status = ItemStatus.SOLD_OUT;
    return item;
  }
  delateStatus(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
