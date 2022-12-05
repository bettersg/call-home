'use strict';

/**
 * smoke-test service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::smoke-test.smoke-test');
