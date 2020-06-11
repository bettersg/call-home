const { DataTypes, Model } = require('sequelize');

function ContactModel(sequelize) {
  class Contact extends Model {}
  Contact.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        // TODO add validation based on country code and whatnot
        // validate: {},
      },
    },
    {
      sequelize,
      modelName: 'Contact',
    }
  );
  return Contact;
}

module.exports = ContactModel;
