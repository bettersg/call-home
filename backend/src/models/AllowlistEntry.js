const { DataTypes, Model } = require('sequelize');
const { UserTypes } = require('./User');

// Allowlists a number for our pilot
function AllowlistEntryModel(sequelize) {
  class AllowlistEntry extends Model {}
  AllowlistEntry.init(
    {
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          is: {
            args: [/\+65[0-9]{8}$/],
            msg:
              'Phone number should start with +65 and be followed by 8 digits.',
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [Object.values(UserTypes)],
            msg: 'Invalid user type specified. Must be ADMIN or USER',
          },
        },
      },
      // TODO validate this better
      destinationCountry: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['SG', 'BD', '']],
        },
      },
    },
    {
      sequelize,
      modelName: 'AllowlistEntry',
    }
  );
  return AllowlistEntry;
}

module.exports = AllowlistEntryModel;
