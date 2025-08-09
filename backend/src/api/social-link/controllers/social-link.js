'use strict';

/**
 * social-link controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::social-link.social-link', ({ strapi }) => ({
  async find(ctx) {
    return await strapi.documents('api::social-link.social-link').findMany({
      ...ctx.query,
      filters: {
        is_active: true,
        ...ctx.query.filters,
      },
      sort: { display_order: 'asc' },
    });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    return await strapi.documents('api::social-link.social-link').findOne({
      documentId: id,
      ...ctx.query,
    });
  },
}));
