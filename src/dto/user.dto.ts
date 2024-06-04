import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { VALIDATION } from '../core/validation/validation';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(VALIDATION.PASSWORD.REGEX, {
    message: VALIDATION.PASSWORD.MESSAGE_ERROR.INVALID_PASSWORD,
  })
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  mail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone: string;
}
