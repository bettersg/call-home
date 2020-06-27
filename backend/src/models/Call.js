const { DataTypes, Model } = require('sequelize');

// This contains the parameters used to create the call and the resulting twilio information.
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
      incomingTwilioCallSid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // This needs to be determined later
      outgoingTwilioCallSid: {
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
