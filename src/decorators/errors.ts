import { HttpException, HttpStatus } from '@nestjs/common'

export class NotFoundException extends HttpException {
  constructor(description: string) {
    super({ description }, HttpStatus.NOT_FOUND)
  }
}

export class ForbiddenException extends HttpException {
  constructor(description: string) {
    super({ description }, HttpStatus.FORBIDDEN)
  }
}

export class UnauthorizedException extends HttpException {
  constructor(description: string) {
    super({ description }, HttpStatus.UNAUTHORIZED)
  }
}
