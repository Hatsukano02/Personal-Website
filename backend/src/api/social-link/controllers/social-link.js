'use strict';

/**
 * social-link controller
 */

module.exports = {
  async find(ctx) {
    return await strapi.entityService.findMany('api::social-link.social-link', {
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
    return await strapi.entityService.findOne('api::social-link.social-link', id, {
      ...ctx.query,
    });
  },
};
