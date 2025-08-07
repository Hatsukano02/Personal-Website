'use strict';

/**
 * social-link router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/social-links',
      handler: 'social-link.find',
      config: {
        auth: false,
      }
    },
    {
      method: 'GET', 
      path: '/social-links/:id',
      handler: 'social-link.findOne',
      config: {
        auth: false,
      }
    }
  ]
};
