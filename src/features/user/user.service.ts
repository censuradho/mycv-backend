import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma.service'
import { CreateUserDto } from './dto/create'
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import { Role } from './model/roles'
import { ForbiddenException } from 'src/decorators/errors'
import { USER_ERRORS } from './errors'

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
    })
  }
}
