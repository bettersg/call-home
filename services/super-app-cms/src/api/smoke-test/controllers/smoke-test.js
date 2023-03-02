'use strict';

/**
 * smoke-test controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::smoke-test.smoke-test');
