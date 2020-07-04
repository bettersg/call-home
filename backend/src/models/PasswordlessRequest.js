const { DataTypes, Model } = require('sequelize');

function PasswordlessRequestModel(sequelize) {
  class PasswordlessRequest extends Model {}
  PasswordlessRequest.init(
    {
      requestTime: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'PasswordlessRequest',
    }
  );
  return PasswordlessRequest;
}

module.exports = PasswordlessRequestModel;
