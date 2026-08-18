'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

// Public storefront must not read this type directly.
// Nuxt BFF uses STRAPI_TOKEN (server-only) for GET/PUT.
module.exports = createCoreRouter('api::store-setting.store-setting');
