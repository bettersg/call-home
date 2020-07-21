const { sanitizeDbErrors } = require('./lib');
const { UserTypes } = require('../models');

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

  async function getUserByPhoneNumber(phoneNumber) {
    return UserModel.findOne({
      where: {
        phoneNumber,
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

  // This function handles a request to assign a phone number to a given user.
  async function verifyUserPhoneNumber(userId, phoneNumber) {
    // We check the allowlist to ensure that the phone number is allowed in the first place.
    const [user, allowlistEntry] = await Promise.all([
      getUser(userId),
      allowlistEntryService.getAllowlistEntryByPhoneNumber(phoneNumber),
    ]);

    // If the user is not allow, we can just stop here
    if (!allowlistEntry) {
      return user;
    }

    // Otherwise, we need to consider the case where the phone number is already registered with another user.
    // Phone numbers must be unique, so before we can do anything, we must invalidate the other user
    const conflictingUserForPhoneNumber = await getUserByPhoneNumber(
      phoneNumber
    );
    if (conflictingUserForPhoneNumber) {
      conflictingUserForPhoneNumber.phoneNumber = null;
      conflictingUserForPhoneNumber.isPhoneNumberValidated = false;
      conflictingUserForPhoneNumber.destinationCountry = null;
      conflictingUserForPhoneNumber.role = UserTypes.USER;
      await conflictingUserForPhoneNumber.save();
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
