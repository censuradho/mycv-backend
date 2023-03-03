import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { environments } from './config/environments'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableCors({
    origin: function (origin, callback) {
      callback(null, true)
      if (environments.nodeEnv !== 'production') return callback(null, true)

      if (!origin || environments.cors.origin.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  })

  await app.listen(environments.port)
}
bootstrap()
