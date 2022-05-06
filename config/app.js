require("dotenv").config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV,

  appKey: process.env.APP_KEY,
  appUrl: process.env.APP_URL,
  appPort: process.env.APP_PORT,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE,

  dbUserDev: process.env.DB_USER_DEV,
  dbPasswordDev: process.env.DB_PASS_DEV,
  dbHostDev: process.env.DB_HOST_DEV,
  dbDatabaseDev: process.env.DB_DB_DEV,

  dbUserTest: process.env.DB_USER_TEST,
  dbPasswordTest: process.env.DB_PASS_TEST,
  dbHostTest: process.env.DB_HOST_TEST,
  dbDatabaseTest: process.env.DB_DB_TEST,

  dbUserDeploy: process.env.DB_USER_DEPLOY,
  dbPasswordDeploy: process.env.DB_PASS_DEPLOY,
  dbHostDeploy: process.env.DB_HOST_DEPLOY,
  dbDatabaseDeploy: process.env.DB_DB_DEPLOY,
};
