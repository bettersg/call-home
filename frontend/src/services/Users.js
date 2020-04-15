import axios from 'axios';

// TODO make this configurable
const userEndpoint = '/users';

export async function getUser(userId) {
  const response = await axios.get(`${userEndpoint}/${userId}`);
  return response.data;
}

export async function updateUser(userId, userLanguages) {
  const originalUser = await getUser(userId);
  const updatedUser = {
    ...originalUser,
    languages: Array.from(userLanguages),
  };

  const response = await axios({
    method: 'put',
    url: `${userEndpoint}/${userId}`,
    data: updatedUser,
  });
  return response.data;
}
