import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'skills không được để trống' })
  @IsArray({ message: 'skills có địng dạng là array' })
  @IsString({ each: true, message: 'skill có định dạng là string' })
  skills: string[];
}
