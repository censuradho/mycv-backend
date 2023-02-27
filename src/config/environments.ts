const env = process.env

export const environments = {
  port: env.PORT || 3333,
  jwtSecret: env.JWT_SECRET,
  cloudinary: {
    name: env.CLOUDINARY_NAME,
    key: env.CLOUDINARY_KEY,
    secret: env.CLOUDINARY_SECRET,
  },
}
