import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  username: string
  @IsEmail()
  email: string
  @MaxLength(20)
  @MinLength(8)
  @IsString()
  password: string
}
