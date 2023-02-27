import { Module } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma.service'
import { CloudinaryModule } from '../cloudinary/cloudinary.module'
import { AvatarService } from './avatar.service'

@Module({
  imports: [CloudinaryModule],
  providers: [AvatarService, PrismaService],
  exports: [AvatarService],
})
export class AvatarModule {}
