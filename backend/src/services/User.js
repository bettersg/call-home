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
    };

    if (userPayload.email) {
      userPayload.email = userPayload.email.toLowerCase();
    }

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

  async function registerUserWithAuth0Id(auth0Id, user) {
    const foundUser = await getUserByAuth0Id(auth0Id);
    if (foundUser) {
      return foundUser;
    }
    return createUser({
      name: user.name,
      email: user.email,
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
    verifyUserPhoneNumber,
    getUserByEmails,
    getUserByAuth0Id,
    registerUserWithAuth0Id,
  };
}

module.exports = UserService;
