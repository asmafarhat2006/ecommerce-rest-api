

const config = {
  db: { /* do not put password or any sensitive info here, done only for demo */
    user: process.env.PGHOST || 'me',
    host: process.env.PGUSER || 'localhost',
    database: process.env.PGDATABASE || 'ecommerce_project',
    password: process.env.PGPASSWORD || 'password',
    port: process.env.PGPORT || 5432,
  }
};

module.exports = config;