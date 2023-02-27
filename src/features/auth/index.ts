import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { jwtConfig } from 'src/config/jwt'
import { UserModule } from '../user'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
  imports: [JwtModule.register(jwtConfig), UserModule],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
