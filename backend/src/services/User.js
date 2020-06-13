const { sanitizeDbErrors } = require('./lib');

async function injectCallees(userOrUsers) {
  return userOrUsers;
  // if (!userOrUsers) {
  //   return userOrUsers;
  // }
  // const isSingular = !Array.isArray(userOrUsers);
  // const users = isSingular ? [userOrUsers] : userOrUsers;
  // const callees = await Promise.all(users.map((user) => user.getCallees()));
  // const injectedUsers = users.map((user, idx) => {
  //   // this needs to be the actual model instance
  //   user.callees = callees[idx]; // eslint-disable-line no-param-reassign
  //   return user;
  // });
  // return isSingular ? injectedUsers[0] : injectedUsers;
}

function UserService(UserModel) {
  async function listUsers() {
    return injectCallees(
      await UserModel.findAll({
        order: ['email'],
      })
    );
  }

  async function createUser(user) {
    const { callees, ...plainUser } = user;
    plainUser.email = plainUser.email.toLowerCase();

    const createdUser = await sanitizeDbErrors(() =>
      UserModel.create(plainUser)
    );
    // await createdUser.setCallees(callees.map((callee) => callee.id));
    await createdUser.save();
    await createdUser.reload();
    return injectCallees(createdUser);
  }

  async function getUser(userId) {
    return injectCallees(
      await UserModel.findOne({
        where: {
          id: userId,
        },
      })
    );
  }

  async function getUserByEmail(userEmail) {
    return injectCallees(
      await UserModel.findOne({
        where: {
          email: userEmail,
        },
      })
    );
  }

  async function updateUser(userId, user) {
    const { callees, ...plainUser } = user;
    plainUser.email = plainUser.email.toLowerCase();

    console.log('useruser', user);
    await UserModel.update(plainUser, {
      where: {
        id: userId,
      },
    });
    const updatedUser = await getUser(userId);
    await updatedUser.setCallees(callees.map((callee) => callee.id));
    await updatedUser.save();
    await updatedUser.reload();
    return injectCallees(updatedUser);
  }

  async function deleteUser(userId) {
    const user = await getUser(userId);
    await user.destroy();
  }

  // TODO this exists only for adding users via oauth. This may not belong here
  async function registerUser(userEmails, name) {
    const allUsers = await Promise.all(
      userEmails.map((userEmail) => getUserByEmail(userEmail))
    );
    const foundUser = allUsers.find((user) => user);
    if (foundUser) {
      return foundUser;
    }
    return createUser({
      name,
      email: userEmails[0],
    });
  }

  return {
    listUsers,
    createUser,
    getUser,
    getUserByEmail,
    updateUser,
    deleteUser,
    registerUser,
  };
}

module.exports = UserService;
