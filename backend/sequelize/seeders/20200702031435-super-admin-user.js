/* eslint-disable */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Foo',
        role: 'ADMIN',
        email: 'my-email@here.com',
        destinationCountry: 'SG',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    await queryInterface.bulkInsert('PhoneNumberValidations', [{
      userId: 1,
      lastRequestTime: null,
      phoneNumber: '+6500000000',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down: (queryInterface, Sequelize) => {},
};
