import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import { PrismaService } from 'src/database/prisma.service'
import { ForbiddenException } from 'src/decorators/errors'
import { CreateUserDto } from './dto/create'
import { USER_ERRORS } from './errors'
import { Role } from './model/roles'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateUserDto) {
    const { email, username, password } = payload

    const userExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userExist) throw new ForbiddenException(USER_ERRORS.USER_ALREADY_EXIST)

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        email,
        username,
        password: passwordHash,
        role: Role.User,
      },
    })

    return {
      ...user,
      password: undefined,
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        avatar: true,
        curriculum: {
          select: {
            slug: true,
          },
        },
      },
    })
  }
}
