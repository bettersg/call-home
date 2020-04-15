const { DataTypes, Model } = require('sequelize');

const UserTypes = {
  CALLER: 'CALLER',
  CALLEE: 'CALLEE',
}

function UserModel(sequelize) {
  class User extends Model {}
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      // TODO yo this is lazy af for sql
      languages: {
        type: DataTypes.STRING,
      },
      userType: {
        type: DataTypes.STRING,
        validate: {
          isIn: Object.values(UserTypes),
        },
      }
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};

module.exports = UserModel;
