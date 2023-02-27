import { Module } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma.service'
import { AvatarModule } from '../avatar'
import { CurriculumController } from './curriculum.controller'
import { CurriculumService } from './curriculum.service'

@Module({
  imports: [AvatarModule],
  providers: [PrismaService, CurriculumService],
  controllers: [CurriculumController],
})
export class CurriculumModule {}
