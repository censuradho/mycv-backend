import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { PrismaService } from './database/prisma.service'
import { FeaturesModule } from './features'
import { JwtAuthGuard } from './features/auth/guards/jwt-auth.guard'
import { RolesGuard } from './features/auth/guards/role.guard'

@Module({
  imports: [ConfigModule.forRoot(), FeaturesModule],
  controllers: [AppController],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
