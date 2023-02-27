import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { CreateUserDto } from '../user/dto/create'
import { User } from '../user/model/user'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators'
import { IsPublic } from './decorators/is-public.decorator'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthRequest } from './models/auth-request'

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request: AuthRequest) {
    return await this.service.login(request.user)
  }

  @IsPublic()
  @Post('sign-up')
  async SignUp(@Body() body: CreateUserDto) {
    return await this.service.SignUp(body)
  }

  @Get('me')
  async findMe(@CurrentUser() user: User, @Request() request: AuthRequest) {
    if (!user)
      throw new UnauthorizedException({
        description: 'SIGN_IN_TO_GET_ME',
      })

    const { ...rest } = await this.service.revalidate(user.email)

    request.user = {
      ...(rest as any as User),
    }

    return rest
  }
}
