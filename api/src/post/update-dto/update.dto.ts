import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  cuisine: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  ingredients: string;
}
