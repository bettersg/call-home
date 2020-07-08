function parseUserRequestBody(req, res, next) {
  const { name, email } = req.body;

  const errorMessages = [];
  if (!name) {
    errorMessages.push("User's name is missing");
  }
  if (!email) {
    errorMessages.push("User's email is missing");
  }
  if (errorMessages.length > 0) {
    return res.status(400).send(`Invalid User: ${errorMessages.join('\n')}`);
  }

  req.body = {
    name,
    email,
  };

  return next();
}

function contactToContactResponse(contact) {
  const { id, name, phoneNumber, avatar } = contact;

  const response = {
    id,
    name,
    phoneNumber,
    avatar,
  };
  return response;
}

function userToUserResponse(user) {
  const {
    id,
    name,
    email,
    destinationCountry,
    phoneNumber,
    role,
    isPhoneNumberValidated: isVerified,
  } = user;

  return {
    id,
    name,
    email,
    destinationCountry,
    phoneNumber,
    role,
    isVerified,
  };
}

function userProfileToUserProfileResponse(userProfile) {
  const { displayName, name, emails, picture, user_id: userId } = userProfile;

  console.log('UserProfile', userProfile);
  return {
    displayName,
    name,
    emails,
    picture,
    userId,
  };
}

function parseContactRequestBody(req, res, next) {
  const { name, phoneNumber, avatar } = req.body;

  const errorMessages = [];
  if (!name) {
    errorMessages.push("Contact's name is missing");
  }
  if (!phoneNumber) {
    errorMessages.push("Contact's phone number is missing");
  }

  req.body = {
    name,
    phoneNumber,
    avatar,
  };

  return next();
}

module.exports = {
  parseUserRequestBody,
  userToUserResponse,
  userProfileToUserProfileResponse,
  parseContactRequestBody,
  contactToContactResponse,
};
