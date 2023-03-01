import { IsArray, IsNumber, ValidateNested } from 'class-validator'

export class PageMetaDto {
  @IsNumber()
  page: number

  @IsNumber()
  count: number

  @IsNumber()
  take: number

  @IsNumber()
  totalPages
}

export class PaginationDto<T> {
  @IsArray()
  @ValidateNested({ each: true })
  readonly data: T[]
  readonly meta: PageMetaDto

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data
    this.meta = meta
  }
}
