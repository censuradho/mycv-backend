import { JwtModuleOptions } from '@nestjs/jwt'
import { environments } from './environments'

export const jwtConfig: JwtModuleOptions = {
  secret: environments.jwtSecret,
  signOptions: {
    expiresIn: 1000,
  },
}
