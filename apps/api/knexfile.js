/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: 'pg',
  connection: {
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
  },
  seeds: {
    directory: __dirname + '/db/seeds',
  },
  pool: {
    min: 2,
    max: 10,
  },
  jsonbSupport: true,
  migrations: {
    tableName: 'knex_migrations',
    directory: __dirname + '/db/migrations',
  },
};
