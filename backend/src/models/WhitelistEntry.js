const { DataTypes, Model } = require('sequelize');

// Whitelists a number for our pilot
function WhitelistEntryModel(sequelize) {
  class WhitelistEntry extends Model {}
  WhitelistEntry.init(
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
      // TODO validate this better
      destinationCountry: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['sg', 'bd', '']],
        },
      },
    },
    {
      sequelize,
      modelName: 'WhitelistEntry',
    }
  );
  return WhitelistEntry;
}

module.exports = WhitelistEntryModel;
