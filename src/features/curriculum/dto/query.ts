import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class QueryDto {
  @IsOptional()
  @IsString()
  q: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  take: number
}
