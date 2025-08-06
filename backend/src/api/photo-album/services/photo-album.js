'use strict';

/**
 * photo-album service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::photo-album.photo-album');
