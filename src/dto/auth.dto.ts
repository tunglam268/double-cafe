import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  accessToken: string;
}
