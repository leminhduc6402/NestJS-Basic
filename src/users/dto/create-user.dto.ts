import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  // @IsEmail({}, {message: "Email không đúng định dạng"})
  // @IsNotEmpty({message: "Email không được để trống"})
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @IsNotEmpty({message: "Password không được để trống"})
  @IsNotEmpty()
  password: string;

  name: string;

  address: string;
}
