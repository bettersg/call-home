const { DataTypes, Model } = require('sequelize');

const UserTypes = {
  ADMIN: 'ADMIN',
  CALLER: 'CALLER',
};

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
      userType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [Object.values(UserTypes)],
            msg: 'Invalid user type specified. Must be ADMIN or CALLER',
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
  UserTypes,
};
