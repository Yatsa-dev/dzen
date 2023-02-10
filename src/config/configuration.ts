export default () => ({
  database: {
    type: process.env.DB_TYPE || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_DATABASE || 'dzencode',
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET || 'secret',
    jwtExpiresInt: parseInt(process.env.JWT_EXPIRES_IN) || 3600,
  },
  port: parseInt(process.env.PORT) || 3000,
  saltRounds: parseInt(process.env.SALT_ROUNDS),
  googleStorage: process.env.GOOGLE_STORAGE,
});
