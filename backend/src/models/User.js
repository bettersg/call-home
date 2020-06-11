const { DataTypes, Model } = require('sequelize');

function UserModel(sequelize) {
  class User extends Model {}
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Email field must have email format',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
}

module.exports = {
  model: UserModel,
};
