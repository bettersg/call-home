const { DataTypes, Model } = require('sequelize');

function CallModel(sequelize) {
  class Call extends Model {}
  Call.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // TODO update this with twilio info as it goes on
    },
    {
      sequelize,
      modelName: 'Call',
    }
  );
  return Call;
}

module.exports = CallModel;
