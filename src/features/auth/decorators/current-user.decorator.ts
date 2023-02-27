import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from 'src/features/user/model/user'
import { AuthRequest } from '../models'

export const CurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<AuthRequest>()

    const { user } = request

    return data ? user?.[data] : user
  }
)
