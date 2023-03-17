import { Type } from 'class-transformer';
import { IsInt, isNotEmpty, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateItemDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
