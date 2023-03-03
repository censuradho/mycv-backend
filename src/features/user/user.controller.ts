import { Body, Controller, Put } from '@nestjs/common'
import { UpdateUserDto } from './dto/update'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Put()
  async update(@Body() body: UpdateUserDto) {
    await this.service.update(body)
  }
}
