/* eslint-disable */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('AllowlistEntries', [
      {
        phoneNumber: 'my number here',
        role: 'ADMIN',
        destinationCountry: 'SG',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {},
};
