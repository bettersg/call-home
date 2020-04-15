const express = require('express')

// Reads a req and parses the body into a user that can be saved.
// TODO transformers should probably be in another module.
function parseUserRequestBody(req, res, next) {
  const {
    name,
    phoneNumber,
    languages
  } = req.body;

  if (!name || !phoneNumber || !languages) {
    res.status(400).send('User is missing fields');
  }
  if (!Array.isArray(languages)) {
    res.status(400).send('Languages should be an array of strings');
  }

  req.body = {
    name,
    phoneNumber,
    languages: languages.join(','),
  };

  next();
}

function userToUserResponse(user) {
  const {
    id,
    name,
    phoneNumber,
    languages,
  } = user;

  return {
    id,
    name,
    phoneNumber,
    languages: languages.split(','),
  };
}

function UserRoutes(userService) {
  const router = express.Router()

  router.get('/:userId', async (req, res) => {
    const user = await userService.getUser(req.params.userId);
    res.status(200).json(userToUserResponse(user));
  })

  router.post('/', parseUserRequestBody, async (req, res) => {
    const user = userRequestToUser(req.body);
    const savedUser = await userService.createUser(user);
    res.status(200).json(userToUserResponse(savedUser));
  });

  router.put('/:userId', parseUserRequestBody, async (req, res) => {
    const user = userRequestToUser(req.body);
    const savedUser = await userService.updateUser(req.params.userId, user);
    res.status(200).json(userToUserResponse(savedUser));
  });
  return router;
}

module.exports = UserRoutes;
