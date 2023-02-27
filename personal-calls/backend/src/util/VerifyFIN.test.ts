import validateFIN from './VerifyFIN';

test('Valid FIN', () => {
  expect(validateFIN('F1234567N')).toBeTruthy();
});

test('Lowercase first alphabet', () => {
  expect(validateFIN('f3725759K')).toBeTruthy();
});

test('Lowercase last alphabet', () => {
  expect(validateFIN('G8976611m')).toBeTruthy();
});

test('Invalid FIN', () => {
  expect(validateFIN('G1234567A')).toBeFalsy();
});

test('Less than 9 characters', () => {
  expect(validateFIN('F123456A')).toBeFalsy();
});

test('More than 9 characters', () => {
  expect(validateFIN('G12345678A')).toBeFalsy();
});

test('Numbers only without alphabet', () => {
  expect(validateFIN('123456789')).toBeFalsy();
});

test('M series', () => {
  // One of each checksum letter
  expect(validateFIN('M4627182X')).toBeTruthy();
  expect(validateFIN('M1108730W')).toBeTruthy();
  expect(validateFIN('M4503401U')).toBeTruthy();
  expect(validateFIN('M4460557T')).toBeTruthy();
  expect(validateFIN('M7986532R')).toBeTruthy();
  expect(validateFIN('M1782041Q')).toBeTruthy();
  expect(validateFIN('M2682514P')).toBeTruthy();
  expect(validateFIN('M2966069N')).toBeTruthy();
  expect(validateFIN('M2966078J')).toBeTruthy();
  expect(validateFIN('M2083705L')).toBeTruthy();
  expect(validateFIN('M1234567K')).toBeTruthy();

  expect(validateFIN('M1234567X')).toBeFalsy();
  expect(validateFIN('M4627182K')).toBeFalsy();
  expect(validateFIN('M8967779T')).toBeFalsy();
  expect(validateFIN('M4460557X')).toBeFalsy();
  expect(validateFIN('M2966069P')).toBeFalsy();
  expect(validateFIN('M2682514N')).toBeFalsy();
  expect(validateFIN('M6198505L')).toBeFalsy();
  expect(validateFIN('M2083705T')).toBeFalsy();
});
