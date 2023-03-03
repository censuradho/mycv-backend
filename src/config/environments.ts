const env = process.env

export const environments = {
  nodeEnv: env.NODE_ENV || 'development',
  port: env.PORT || 3333,
  jwtSecret: env.JWT_SECRET,
  cloudinary: {
    name: env.CLOUDINARY_NAME,
    key: env.CLOUDINARY_KEY,
    secret: env.CLOUDINARY_SECRET,
  },
  cors: {
    origin: env.DOMAINS?.split(',') || [''],
  },
}
