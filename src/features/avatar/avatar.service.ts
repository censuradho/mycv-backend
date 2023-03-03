import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma.service'
import { ForbiddenException } from 'src/decorators/errors'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { AVATAR_ERRORS } from './errors'

@Injectable()
export class AvatarService {
  constructor(
    private readonly cloudnary: CloudinaryService,
    private readonly prisma: PrismaService
  ) {}

  async upload(file: Express.Multer.File, userId: string) {
    const avatarExist = await this.findUserById(userId)

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

  async findUserById(userId: string) {
    return this.prisma.avatar.findUnique({
      where: {
        user_id: userId,
      },
    })
  }

  async destroy(public_ids: string[]) {
    try {
      const existAvatar = await this.prisma.avatar.findMany({
        where: {
          user_id: {
            in: public_ids,
          },
        },
      })

      if (!existAvatar || existAvatar.length === 0)
        throw new ForbiddenException(AVATAR_ERRORS.NOT_FOUND)

      const idsToDelete = existAvatar.map((value) => value.id)

      await Promise.all([
        this.cloudnary.destroyFiles(idsToDelete),
        this.prisma.avatar.deleteMany({
          where: {
            id: {
              in: idsToDelete,
            },
          },
        }),
      ])
    } catch (err) {
      console.log(err)
    }
  }
}
