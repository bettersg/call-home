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
  const { id, name, phoneNumber } = contact;

  const response = {
    id,
    name,
    phoneNumber,
  };
  return response;
}

function userToUserResponse(user) {
  const { id, name, email } = user;

  return {
    id,
    name,
    email,
  };
}

function userProfileToUserProfileResponse(userProfile) {
  const { displayName, name, emails, picture } = userProfile;

  return {
    displayName,
    name,
    emails,
    picture,
  };
}

function parseContactRequestBody(req, res, next) {
  const { name, phoneNumber } = req.body;

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
