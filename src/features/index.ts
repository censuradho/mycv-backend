import { Module } from '@nestjs/common'
import { AuthModule } from './auth'
import { CurriculumModule } from './curriculum'
import { UserModule } from './user'

@Module({
  imports: [UserModule, AuthModule, CurriculumModule],
  exports: [UserModule, AuthModule, CurriculumModule],
})
export class FeaturesModule {}
