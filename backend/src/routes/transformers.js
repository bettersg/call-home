function parseUserRequestBody(req, res, next) {
  const {
    name,
    email,
    userType,
    // TODO we're gon be lazy af and assume that we always work with callees
    callees = [],
  } = req.body;

  const errorMessages = [];
  if (!name) {
    errorMessages.push("User's name is missing");
  }
  if (!email) {
    errorMessages.push("User's email is missing");
  }
  if (!userType) {
    errorMessages.push("User's type is missing");
  }
  if (errorMessages.length > 0) {
    return res.status(400).send(`Invalid User: ${errorMessages.join('\n')}`);
  }

  req.body = {
    name,
    email,
    userType,
    callees,
  };

  return next();
}

function calleeToCalleeResponse(callee, isAdmin) {
  const { id, name, phoneNumber } = callee;

  const response = {
    id,
    name,
  };
  if (isAdmin) {
    response.phoneNumber = phoneNumber;
  }
  return response;
}

function userToUserResponse(user, isAdmin) {
  const { id, name, email, userType, callees } = user;

  return {
    id,
    name,
    email,
    userType,
    callees: callees.map((callee) => calleeToCalleeResponse(callee, isAdmin)),
  };
}

function userProfileToUserProfileResponse(userProfile) {
  const { displayName, name, emails, picture, role } = userProfile;

  return {
    displayName,
    name,
    emails,
    picture,
    role,
  };
}

function parseCalleeRequestBody(req, res, next) {
  const { name, phoneNumber } = req.body;

  const errorMessages = [];
  if (!name) {
    errorMessages.push("Callee's name is missing");
  }
  if (!phoneNumber) {
    errorMessages.push("Callee's phone number is missing");
  }
  if (errorMessages.length > 0) {
    return res.status(400).send(`Invalid Callee: ${errorMessages.join('\n')}`);
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
  parseCalleeRequestBody,
  calleeToCalleeResponse,
};
