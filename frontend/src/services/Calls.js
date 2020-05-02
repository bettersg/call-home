import axios from 'axios';

// TODO make this configurable
const callEndpoint = '/calls';

export default async function getToken() {
  const response = await axios.get(`${callEndpoint}/token`);
  return response.data;
}
