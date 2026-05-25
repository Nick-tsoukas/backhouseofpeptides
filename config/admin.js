module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'admin-jwt-secret-key'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'api-token-salt-key'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'transfer-token-salt-key'),
    },
  },
});
