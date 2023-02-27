/* Sources:
References supporting the FG algorithm
http://www.ngiam.net/NRIC/ppframe.htm

M algorithm scraped from
https://samliew.com/nric-generator

See also:
https://nric.biz (generate and validate FIN)
*/

const fgCheck = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
const mCheck = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'J', 'L', 'K'];
const weightArray = [2, 7, 6, 5, 4, 3, 2];

interface SeriesConfig {
  offset: number;
  checkArr: string[];
}

const seriesConfigs: Record<string, SeriesConfig> = {
  F: {
    offset: 0,
    checkArr: fgCheck,
  },
  G: {
    offset: 4,
    checkArr: fgCheck,
  },
  M: {
    offset: 3,
    checkArr: mCheck,
  },
};

function validateFIN(finLower: string): boolean {
  const fin = finLower.trim().toUpperCase();
  if (fin.length !== 9) {
    return false;
  }

  const conf = seriesConfigs[fin[0]];
  if (!conf) {
    return false;
  }

  const numArray = fin.slice(1, 8).split('').map(Number); // FIN String into array of numbers to multiply by weight
  let sum = 0;
  for (let i = 0; i < numArray.length; i += 1) {
    sum += numArray[i] * weightArray[i];
  } // Cross multiply with weightArray to get sum
  sum += conf.offset;

  return conf.checkArr[sum % 11] === fin.slice(-1);
}

export default validateFIN;
