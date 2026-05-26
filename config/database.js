const path = require('path');

module.exports = ({ env }) => {
  const databaseUrl = env('DATABASE_URL', '');

  if (databaseUrl) {
    // Parse the URL so Knex gets explicit fields — avoids ENOTFOUND on Railway
    let parsed;
    try {
      parsed = new URL(databaseUrl);
    } catch (e) {
      throw new Error(`DATABASE_URL is set but could not be parsed: ${e.message}`);
    }

    return {
      connection: {
        client: 'postgres',
        connection: {
          host: parsed.hostname,
          port: parseInt(parsed.port || '5432', 10),
          database: parsed.pathname.replace(/^\//, ''),
          user: parsed.username,
          password: parsed.password,
          ssl: parsed.hostname.endsWith('.railway.internal')
            ? false
            : { rejectUnauthorized: false },
        },
        acquireConnectionTimeout: 60000,
      },
    };
  }

  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', '.tmp', 'data.db'),
      },
      useNullAsDefault: true,
    },
  };
};
