const express = require('express');
const { requireAdmin } = require('./middlewares');
const { UserTypes } = require('../models');
const {
  parseUserRequestBody,
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

  router.get('/', requireAdmin, async (req, res) => {
    console.log('listing all users');
    const allUsers = await userService.listUsers();
    console.log(allUsers);
    return res
      .status(200)
      .json(allUsers.map((user) => userToUserResponse(user)));
  });

  router.get('/:userId', requireAdmin, async (req, res) => {
    const user = await userService.getUser(req.params.userId);
    res.status(200).json(userToUserResponse(user));
  });

  router.post('/', parseUserRequestBody, requireAdmin, async (req, res) => {
    const user = req.body;
    try {
      const savedUser = await userService.createUser(user);
      console.log('created user', user);
      return res.status(200).json(userToUserResponse(savedUser, true));
    } catch (e) {
      // TODO do this smarter
      if (e.message.startsWith('Validation Error:')) {
        return res.status(400).send(e.message);
      }
      return res.status(500);
    }
  });

  router.put(
    '/:userId',
    parseUserRequestBody,
    requireAdmin,
    async (req, res) => {
      const user = req.body;
      const savedUser = await userService.updateUser(req.params.userId, user);
      res.status(200).json(userToUserResponse(savedUser));
    }
  );

  router.delete('/:userId', requireAdmin, async (req, res) => {
    await userService.deleteUser(req.params.userId);
    res.status(200).send();
  });
  return router;
}

module.exports = UserRoutes;
