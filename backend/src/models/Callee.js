const { DataTypes, Model } = require('sequelize');

function CalleeModel(sequelize) {
  class Callee extends Model {}
  Callee.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          is: {
            args: [/\+65[0-9]{8}$/],
            msg:
              'Phone number should start with +65 and be followed by 8 digits.',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Callee',
    }
  );
  return Callee;
}

module.exports = CalleeModel;
