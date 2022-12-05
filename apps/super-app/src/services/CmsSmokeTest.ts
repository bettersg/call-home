const smokeTestEndpoint = '/api/smoke-test'

// TODO move this into a better module
// Strapi wraps each model in a "data". Inside which, the things we care about
// are in "attributes".
interface StrapiModelResponse<T> {
  data: {
    attributes: T
  }
}

interface SmokeTestView {
  test: boolean
}

async function isUp(): Promise<boolean> {
  const response = await fetch(smokeTestEndpoint);
  const json: StrapiModelResponse<SmokeTestView> = await response.json();
  // Expect that the value we got is actually `true`.
  return !!json.data.attributes.test;
}

export async function consoleSmokeTest() {
  const up = await isUp();
  if (up) {
    console.log('Connected to Strapi backend!!');
    return;
  }
  console.error('Failed to connect to Strapi backend. Bad things might ensue.')
}
