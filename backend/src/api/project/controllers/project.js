"use strict";

/**
 * project controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::project.project", ({ strapi }) => ({
  async find(ctx) {
    return await strapi.documents("api::project.project").findMany({
      ...ctx.query,
      populate: {
        featured_image: true,
        featured_video: true,
        featured_audio: true,
      },
      sort: { createdAt: "desc" },
    });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    return await strapi.documents("api::project.project").findOne({
      documentId: id,
      ...ctx.query,
      populate: {
        featured_image: true,
        featured_video: true,
        featured_audio: true,
      },
    });
  },
}));
