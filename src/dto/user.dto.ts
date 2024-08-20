import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { VALIDATION } from '../core/validation/validation';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from './pagination.dto';
import { Transform } from 'class-transformer';

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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiPropertyOptional()
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
  @Matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/, {
    message: 'Số điện thoại không phù hợp',
  })
  phone: string;
}

export class FilterDTO extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Mail' })
  @IsOptional()
  @IsEmail()
  mail: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @Matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/)
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({ description: 'Tên' })
  @IsOptional()
  fullName: string;
}

export class GetUserByFilter {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: 'ID must be number' })
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  id: number;
}
