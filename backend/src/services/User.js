function UserService(UserModel) {
  async function listUsers() {
    return UserModel.findAll();
  }

  async function createUser(user) {
    return UserModel.create(user);
  }

  async function getUser(userId) {
    return UserModel.findOne({
      where: {
        id: userId,
      },
    });
  }

  async function updateUser(userId, user) {
    await UserModel.update(user, {
      where: {
        id: userId,
      },
    });
    return getUser(userId);
  }

  return {
    listUsers,
    createUser,
    getUser,
    updateUser,
  };
};

module.exports = UserService;
