import axios from 'axios';

// TODO make this configurable
const tokenEndpoint = '/twilio/token';

export default async function getToken() {
  const response = await axios.get(tokenEndpoint);
  return response.data;
}
