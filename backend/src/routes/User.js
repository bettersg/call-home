const express = require('express');
const { UserTypes } = require('../models');
const {
  userToUserResponse,
  userProfileToUserProfileResponse,
} = require('./transformers');

// Reads a req and parses the body into a user that can be saved.
// TODO transformers should probably be in another module.

function UserRoutes(userService) {
  const router = express.Router();

  router.get('/me', async (req, res) => {
    // This returns the OAuth user info
    const { _raw, _json, ...userProfile } = req.user;
    const userProfileResponse = userProfileToUserProfileResponse(
      userProfile,
      userProfile.userType === UserTypes.ADMIN
    );

    console.log('Getting info for user profile', userProfile);
    const allPossibleUsers = await Promise.all(
      req.user.emails.map((emailValue) =>
        userService.getUserByEmail(emailValue.value)
      )
    );
    const validUsers = allPossibleUsers.filter((user) => user);
    if (validUsers.length < 1) {
      return res.status(404).send('Not found');
    }
    const userResponse = userToUserResponse(validUsers[0]);
    return res.status(200).json({
      ...userProfileResponse,
      ...userResponse,
    });
  });

  return router;
}

module.exports = UserRoutes;
