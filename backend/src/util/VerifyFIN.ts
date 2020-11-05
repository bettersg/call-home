/* Sources:
References supporting the algorithm
http://www.ngiam.net/NRIC/ppframe.htm

To generate and validate FINs
https://nric.biz
https://samliew.com/nric-generator
*/

const checkAlpha = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
const weightArray = [2, 7, 6, 5, 4, 3, 2];

function validateFIN(fin: string): boolean {
  const finUpper = fin.trim().toUpperCase();
  if (finUpper.length !== 9) {
    return false;
  }

  const numArray = fin.slice(1, 8).split('').map(Number); // FIN String into array of numbers to multiply by weight
  let sum = 0;
  for (let i = 0; i < numArray.length; i += 1) {
    sum += numArray[i] * weightArray[i];
  } // Cross multiply with weightArray to get sum

  if (finUpper[0] === 'G') {
    sum += 4;
  } // FIN that starts with G has their checkAlpha shifted by 4

  return checkAlpha[sum % 11] === finUpper.slice(-1);
}

export default validateFIN;
