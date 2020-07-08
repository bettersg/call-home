const { DataTypes, Model } = require('sequelize');

const UserTypes = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

function UserModel(sequelize) {
  class User extends Model {}
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
        defaultValue: UserTypes.USER,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Email field must have email format',
          },
        },
      },
      auth0Id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
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
      isPhoneNumberValidated: {
        type: DataTypes.BOOLEAN,
        default: false,
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
      modelName: 'User',
    }
  );
  return User;
}

module.exports = {
  model: UserModel,
  UserTypes,
};
