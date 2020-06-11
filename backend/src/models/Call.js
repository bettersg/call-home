const { DataTypes, Model } = require('sequelize');

function CallModel(sequelize) {
  class Call extends Model {}
  Call.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contactId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      twilioCallId: {
        type: DataTypes.STRING,
      },
      twilioCallStatus: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Call',
    }
  );
  return Call;
}

module.exports = CallModel;
