import axios from 'axios';
import cheerio from 'cheerio';
import { DateTime } from 'luxon';
import qs from 'querystring';

const workpassEndpoint =
  'https://service2.mom.gov.sg/nwpma/webresources/cwp/checkwpstatus/';

export type WorkpassStatus = 'valid' | 'invalid' | 'error' | 'unknown';

interface WorkpassResponse {
  // TODO figure out what the full range of values is
  status: 'Success' | 'CardNotFound';
  card: {
    lost: boolean;
    // TODO good reason to believe that this is a number too
    dateOfCancellation: number | null;
    dateOfExpiry: number;
    fin: string | null;
    dateOfApplication: null;
    passStatus: 'Valid' | 'Cancelled';
    csn: string;
  } | null;
}

interface WorkpassResult {
  status: WorkpassStatus;
  expiry: DateTime | null;
}

async function getSerialNumberStatus(
  serialNumberUntrimmed: string
): Promise<WorkpassResult> {
  const serialNumber = serialNumberUntrimmed.trim();
  const queryUrl = `${workpassEndpoint}${serialNumber}`;
  const response = await axios.get(queryUrl);
  const responseJson: WorkpassResponse = response.data;

  const expiryDateMillis = responseJson.card?.dateOfExpiry;
  if (responseJson.status !== 'Success' || !expiryDateMillis) {
    return {
      status: 'unknown',
      expiry: null,
    };
  }

  const expiryDateTime = DateTime.fromMillis(expiryDateMillis);

  // Apparently, even if the status is 'Valid', it can still be expired
  if (
    responseJson.card?.passStatus !== 'Valid' ||
    expiryDateTime < DateTime.now()
  ) {
    return {
      status: 'invalid',
      expiry: expiryDateTime,
    };
  }

  return {
    status: 'valid',
    expiry: expiryDateTime,
  };
}

export { getSerialNumberStatus };
