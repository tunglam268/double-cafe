import {
  IsEmail,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Max,
  Min
} from "class-validator";
import { VALIDATION } from '../core/validation/validation';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from "./pagination.dto";
import { Transform } from "class-transformer";

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

export class FilterDTO extends PageOptionsDto{
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  mail: string;

  @ApiPropertyOptional()
  @IsPhoneNumber('VN')
  @IsOptional()
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  fullName: string;
}
