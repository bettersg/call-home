const checkAlpha = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
const weightArray = [2, 7, 6, 5, 4, 3, 2];

function validateFIN(fin: string): string {
  const finUpper = fin.toUpperCase();
  if (finUpper.length === 9) {
    const sumArray = fin.slice(1, 8).split('').map(Number); // FIN String into array of numbers to multiply by weight

    let sum = 0;
    for (let i = 0; i < sumArray.length; i += 1) {
      sum += sumArray[i] * weightArray[i];
    } // Cross multiply with weightArray to get sum

    if (finUpper[0] === 'G') {
      sum += 4;
    } // FIN that starts with G has their checkAlpha shifted by 4

    if (checkAlpha[sum % 11] === finUpper.slice(-1)) {
      return `${fin} is a valid FIN.`;
    }
    return `${fin} is an invalid FIN.`;
  }
  return 'Wrong Format.';
}

export default validateFIN;

// Tests
// console.log(validateFIN("F1234567N")) // Valid
// console.log(validateFIN("F1234567A")) // Invalid
// console.log(validateFIN("G123456T" )) // Not 9 digits.
// console.log(validateFIN("123456789")) // 9 numbers.
// console.log(validateFIN("f3725759K")) // Lowercase first alpha
// console.log(validateFIN("G8977661p")) // Lowercase last alpha
