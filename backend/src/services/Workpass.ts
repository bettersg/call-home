import axios from 'axios';
import cheerio from 'cheerio';
import qs from 'querystring';

const workpassWebsite = 'https://checkwpstatus.mom.gov.sg/Pages/home.aspx';
const inputsSelector = '#aspnetForm input';
const serialNumberInputName =
  'ctl00$ctl40$g_6970c440_5b2c_4b60_ad5e_3fc670e7fb1f$txtCsn';
const validSelector = '.resultValidHeader';
const invalidSelector = '.resultInvalidHeader';
const errorMessageSelector = '.errorMessage';

type ValidationState = 'valid' | 'invalid' | 'error' | 'unknown';

interface CheerioAttribs {
  attribs: Record<string, string>;
}

async function getFormInputs() {
  const response = await axios.get(workpassWebsite);
  const $ = cheerio.load(response.data);
  const formInputs = ($(inputsSelector).get() as CheerioAttribs[]).reduce(
    (acc, curr) => ({
      [curr.attribs.name]: curr.attribs.value,
      ...acc,
    }),
    {} as Record<string, string>
  );
  return formInputs;
}

async function checkSerialNumber(
  serialNumber: string
): Promise<ValidationState> {
  const sourceFormInputs = await getFormInputs();
  const formInputs = {
    ...sourceFormInputs,
    [serialNumberInputName]: serialNumber,
  };
  const response = await axios.post(workpassWebsite, qs.stringify(formInputs), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const $ = cheerio.load(response.data);

  // If present, there is an valid result, otherwise the html() method returns null.
  const isValidPresent = Boolean($(validSelector).html());
  if (isValidPresent) {
    return 'valid';
  }

  // If present, there is an invalid result, otherwise the html() method returns null.
  const isInvalidPresent = Boolean($(invalidSelector).html());
  if (isInvalidPresent) {
    return 'invalid';
  }

  // This seems to always be present, but we can check whether or not there is an error message based on whether the inner html is empty i.e. ''.
  const isErrored = Boolean($(errorMessageSelector).html());
  if (isErrored) {
    return 'error';
  }

  // Otherwise, we don't know what happened
  return 'unknown';
}

export default {
  checkSerialNumber,
};
