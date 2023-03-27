'use strict';

// Use the Entity Service API to seed the database with our defaults
// https://docs.strapi.io/dev-docs/api/entity-service/crud#create

async function createIfEmpty(strapi, uid, data) {
  // entities is null if no entries are found.
  const entities = await strapi.entityService.findMany(uid, {limit: 1 });
  if (!entities) {
    await strapi.entityService.create(uid, {data});
  }
}

const seedData = [
  [
    'api::smoke-test.smoke-test',
    {
      test: true
    }
  ]
]

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    await Promise.all(seedData.map(([uid, data]) => createIfEmpty(strapi, uid, data)));
  },
};
