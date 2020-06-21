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
      avatar: {
        type: DataTypes.STRING,
        // TODO validate this
        // should have the format "{avatar_group}_{avatar_variant}" e.g. male_4, female_2
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
