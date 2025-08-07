'use strict';

/**
 * project controller
 */

module.exports = {
  async find(ctx) {
    return await strapi.entityService.findMany('api::project.project', {
      ...ctx.query,
      populate: {
        featured_image: true,
        technology_stack: true,
      },
      sort: { created_at: 'desc' },
    });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    return await strapi.entityService.findOne('api::project.project', id, {
      ...ctx.query,
      populate: {
        featured_image: true,
        technology_stack: true,
        gallery: true,
      },
    });
  },
};
