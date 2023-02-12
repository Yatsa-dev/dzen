import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  image?: string;
  owner?: number;
  email?: string;
  file?: Buffer;
  createdAt: Date;
}
