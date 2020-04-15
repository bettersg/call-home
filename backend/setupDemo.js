const userService = require('./src/services').User;

module.exports = async function setupDemo() {
  const demoUser = {
    name: 'Glen',
    phoneNumber: '+6512345678',
    languages: 'english,mandarin',
    userType: 'CALLER',
  }

  const allUsers = await userService.listUsers();

  if (!allUsers.find(user => user.name === demoUser.name)) {
    await userService.createUser(demoUser);
  }

  console.log('Demo users set up');
  console.log(await userService.listUsers());
};
