require('dotenv').config();

module.exports = {
  app: {
    name: process.env.APP_NAME || 'E-Commerce App',
    version: process.env.APP_VERSION || '1.0.0',
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  session: {
    secret: process.env.SESSION_SECRET || 'your-super-secret-session-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  },

  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};
