'use strict';

// Content-type actions the public (unauthenticated) storefront must be able to read.
const PUBLIC_READ_ACTIONS = [
  'api::product.product.find',
  'api::product.product.findOne',
  'api::variant.variant.find',
  'api::variant.variant.findOne',
];

module.exports = {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) {
        strapi.log.warn('[bootstrap] Public role not found; skipping permission setup.');
        return;
      }

      for (const action of PUBLIC_READ_ACTIONS) {
        const existing = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action, role: publicRole.id } });

        if (!existing) {
          await strapi
            .query('plugin::users-permissions.permission')
            .create({ data: { action, role: publicRole.id } });
          strapi.log.info(`[bootstrap] Granted public permission: ${action}`);
        }
      }
    } catch (err) {
      strapi.log.error(`[bootstrap] Failed to set public read permissions: ${err.message}`);
    }
  },
};
