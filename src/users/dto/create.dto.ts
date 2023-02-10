import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  logo?: string;
}
