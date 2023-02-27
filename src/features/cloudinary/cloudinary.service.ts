import { Injectable, Logger } from '@nestjs/common'
import sharp from 'sharp'

import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
  UploadApiOptions,
} from 'cloudinary'

import { Readable } from 'node:stream'
@Injectable()
export class CloudinaryService {
  private logger = new Logger(CloudinaryService.name)

  async uploadImage(
    file: Express.Multer.File,
    options?: UploadApiOptions,
    sharpOptions?: sharp.SharpOptions
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise(async (resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            this.logger.error(error)
            return reject(error)
          }
          return resolve(result)
        }
      )

      const stream: Readable = new Readable()

      if (sharpOptions && file.mimetype.match(/^image/)) {
        const shrinkedImage = await sharp(file.buffer).toBuffer()
        stream.push(shrinkedImage)
      } else {
        stream.push(file.buffer)
      }

      stream.push(null)

      stream.pipe(upload)
    })
  }

  async destroyFiles(public_ids: string[]) {
    return await Promise.all(
      public_ids.map((id) =>
        cloudinary.uploader.destroy(id, { invalidate: true })
      )
    )
  }
}
