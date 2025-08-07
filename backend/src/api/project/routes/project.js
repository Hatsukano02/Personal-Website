'use strict';

/**
 * project router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/projects',
      handler: 'project.find',
      config: {
        auth: false,
      }
    },
    {
      method: 'GET',
      path: '/projects/:id', 
      handler: 'project.findOne',
      config: {
        auth: false,
      }
    }
  ]
};
