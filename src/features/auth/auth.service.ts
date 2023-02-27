import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt'
import { User } from '../user/model/user'
import { JwtService } from '@nestjs/jwt'
import { UserPayload } from './models/user-payload'
import { CreateUserDto } from '../user/dto/create'
import { UnauthorizedException } from 'src/decorators/errors'
import { USER_ERRORS } from '../user/errors'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(user: User) {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email)

    if (!user)
      throw new UnauthorizedException(USER_ERRORS.EMAIL_PASSWORD_INCORRECT)

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword)
      throw new UnauthorizedException(USER_ERRORS.EMAIL_PASSWORD_INCORRECT)

    return {
      ...user,
      password: undefined,
    }
  }

  async revalidate(email: string) {
    const user = await this.userService.findByEmail(email)

    if (!user) throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND)

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    return {
      ...user,
      password: undefined,
      access_token: this.jwtService.sign(payload),
    }
  }

  async SignUp(payload: CreateUserDto) {
    return await this.userService.create(payload)
  }
}
