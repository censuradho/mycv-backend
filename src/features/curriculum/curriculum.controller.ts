import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
  Param,
  Put,
} from '@nestjs/common'
import { UploadedFile } from '@nestjs/common/decorators/http/route-params.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { IsPublic } from '../auth/decorators'
import { CurriculumService } from './curriculum.service'
import { CreateCurriculumDto } from './dto/create'
import { QueryDto } from './dto/query'
import { UpdateCurriculumDto } from './dto/update'

@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly service: CurriculumService) {}

  @Post()
  async create(@Body() body: CreateCurriculumDto) {
    return await this.service.create(body)
  }

  @Get('me')
  async me() {
    return await this.service.me()
  }

  @IsPublic()
  @Get()
  async findMany(@Query() query: QueryDto) {
    return await this.service.findMany(query)
  }

  @IsPublic()
  @Get('all')
  async findAll() {
    return await this.service.findAll()
  }

  @IsPublic()
  @Get(':slug')
  async findBySlug(@Param('slug') id: string) {
    return await this.service.findBySlug(id)
  }

  @Put()
  async update(@Body() body: UpdateCurriculumDto) {
    return await this.service.update(body)
  }

  @Post('/avatar/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.service.avatarUpload(file)
  }

  @Get('skills')
  async findAllSkillsByName(@Query('name') name: string) {
    return await this.service.findAllSkillsByName(name)
  }
}
