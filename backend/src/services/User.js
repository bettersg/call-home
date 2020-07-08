const { sanitizeDbErrors } = require('./lib');

function UserService(UserModel, allowlistEntryService) {
  async function listUsers() {
    return UserModel.findAll({
      order: ['email'],
    });
  }

  async function createUser(user) {
    const createdUser = await sanitizeDbErrors(() =>
      UserModel.create({
        ...user,
        isPhoneNumberValidated: false,
      })
    );
    await createdUser.save();
    await createdUser.reload();
    return createdUser;
  }

  async function getUser(userId) {
    return UserModel.findOne({
      where: {
        id: userId,
      },
    });
  }

  async function getUserByEmail(userEmail) {
    return UserModel.findOne({
      where: {
        email: userEmail,
      },
    });
  }

  async function getUserByAuth0Id(auth0Id) {
    return UserModel.findOne({
      where: {
        auth0Id,
      },
    });
  }

  async function updateUser(userId, user) {
    const userPayload = {
      ...user,
      email: user.email.toLowerCase(),
    };

    await UserModel.update(userPayload, {
      where: {
        id: userId,
      },
    });
    const updatedUser = await getUser(userId);
    return updatedUser;
  }

  async function verifyUserPhoneNumber(userId, phoneNumber) {
    const [user, allowlistEntry] = await Promise.all([
      getUser(userId),
      allowlistEntryService.getAllowlistEntryByPhoneNumber(phoneNumber),
    ]);
    if (!allowlistEntry) {
      return user;
    }

    user.isPhoneNumberValidated = true;
    user.phoneNumber = phoneNumber;
    user.destinationCountry = allowlistEntry.destinationCountry;
    user.role = allowlistEntry.role;
    await user.save();
    await user.reload();
    return user;
  }

  async function deleteUser(userId) {
    const user = await getUser(userId);
    await user.destroy();
  }

  async function getUserByEmails(userEmails) {
    const allUsers = await Promise.all(
      userEmails.map((userEmail) => getUserByEmail(userEmail))
    );
    const foundUser = allUsers.find((user) => user);
    return foundUser;
  }

  // TODO this exists only for adding users via oauth. This may not belong here
  async function registerUser(userEmails, name) {
    const foundUser = await getUserByEmails(userEmails);
    if (foundUser) {
      return foundUser;
    }
    return createUser({
      name,
      email: userEmails[0],
    });
  }

  async function registerUserWithAuth0Id(auth0Id, name) {
    const foundUser = await getUserByAuth0Id(auth0Id);
    if (foundUser) {
      return foundUser;
    }
    return createUser({
      name,
      auth0Id,
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
    verifyUserPhoneNumber,
    getUserByEmails,
    getUserByAuth0Id,
    registerUserWithAuth0Id,
  };
}

module.exports = UserService;
