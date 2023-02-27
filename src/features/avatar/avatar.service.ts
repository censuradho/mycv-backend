import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma.service'
import { CloudinaryService } from '../cloudinary/cloudinary.service'

@Injectable()
export class AvatarService {
  constructor(
    private readonly cloudnary: CloudinaryService,
    private readonly prisma: PrismaService
  ) {}

  async upload(file: Express.Multer.File, userId: string) {
    const avatarExist = await this.findByUser(userId)

    if (avatarExist) {
      await this.destroy([avatarExist.id])
    }

    const response = await this.cloudnary.uploadImage(file)

    return await this.prisma.avatar.create({
      data: {
        id: response.public_id,
        height: response.height,
        url: response.url,
        width: response.width,
        format: response.format,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
  }

  async findByUser(userId: string) {
    return this.prisma.avatar.findUnique({
      where: {
        user_id: userId,
      },
    })
  }

  async destroy(public_ids: string[]) {
    try {
      await Promise.all([
        this.cloudnary.destroyFiles(public_ids),
        this.prisma.avatar.deleteMany({
          where: {
            id: {
              in: public_ids,
            },
          },
        }),
      ])
    } catch (err) {
      console.log(err)
    }
  }
}
