module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Contacts', 'avatar', {
      type: Sequelize.DataTypes.STRING,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Contacts', 'avatar', {
      type: Sequelize.DataTypes.STRING,
    });
  },
};
