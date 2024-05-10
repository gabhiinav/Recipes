import { IsNotEmpty, IsString } from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  cuisine: string;

  @IsNotEmpty()
  @IsString()
  ingredients: string;
}