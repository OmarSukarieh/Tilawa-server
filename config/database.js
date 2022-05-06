const config = require("./app");

module.exports = {
  development: {
    username: config.dbUserDev,
    password: config.dbPasswordDev,
    database: config.dbDatabaseDev,
    host: config.dbHostDev,
    dialect: "postgres",
    logging: false,
  },
  test: {
    username: config.dbUserTest,
    password: config.dbPasswordTest,
    database: config.dbDatabaseTest,
    host: config.dbHostTest,
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: config.dbUserDeploy,
    password: config.dbPasswordDeploy,
    database: config.dbDatabaseDeploy,
    host: config.dbHostDeploy,
    dialect: "postgres",
    logging: false,
  },
};
