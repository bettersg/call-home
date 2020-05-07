const { sanitizeDbErrors } = require('./lib');

async function injectCallees(userOrUsers) {
  if (!userOrUsers) {
    return userOrUsers;
  }
  const isSingular = !Array.isArray(userOrUsers);
  const users = isSingular ? [userOrUsers] : userOrUsers;
  const callees = await Promise.all(users.map((user) => user.getCallees()));
  const injectedUsers = users.map((user, idx) => {
    // this needs to be the actual model instance
    user.callees = callees[idx]; // eslint-disable-line no-param-reassign
    return user;
  });
  return isSingular ? injectedUsers[0] : injectedUsers;
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
    await createdUser.setCallees(callees.map((callee) => callee.id));
    await createdUser.save();
    await createdUser.reload();
    return injectCallees(createdUser);
  }

  async function getUser(userEmail) {
    return injectCallees(
      await UserModel.findOne({
        where: {
          email: userEmail,
        },
      })
    );
  }

  async function updateUser(userEmailUpper, user) {
    const userEmail = userEmailUpper.toLowerCase();
    const { callees, ...plainUser } = user;
    plainUser.email = plainUser.email.toLowerCase();

    console.log('useruser', user);
    await UserModel.update(plainUser, {
      where: {
        email: userEmail,
      },
    });
    const updatedUser = await getUser(userEmail);
    await updatedUser.setCallees(callees.map((callee) => callee.id));
    await updatedUser.save();
    await updatedUser.reload();
    return injectCallees(updatedUser);
  }

  async function deleteUser(userEmailUpper) {
    const userEmail = userEmailUpper.toLowerCase();
    const user = await getUser(userEmail);
    await user.destroy();
  }

  return {
    listUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
  };
}

module.exports = UserService;
