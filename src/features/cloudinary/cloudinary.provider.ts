import { v2 } from 'cloudinary'
import { environments } from 'src/config/environments'
import { CLOUDINARY } from './constants'

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    console.log(environments.cloudinary)
    return v2.config({
      cloud_name: environments.cloudinary.name,
      api_key: '856474167273563',
      api_secret: environments.cloudinary.secret,
    })
  },
}
