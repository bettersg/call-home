'use strict';

/**
 * smoke-test router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::smoke-test.smoke-test');
