import validateFIN from './VerifyFIN';

test('Valid FIN', () => {
  expect(validateFIN('F1234567N')).toBe('VALID');
});

test('Lowercase first alphabet', () => {
  expect(validateFIN('f3725759K')).toBe('VALID');
});

test('Lowercase last alphabet', () => {
  expect(validateFIN('G8976611m')).toBe('VALID');
});

test('Bad checksum', () => {
  expect(validateFIN('G1234567A')).toBe('BAD_CHECKSUM');
});

test('Less than 9 characters', () => {
  expect(validateFIN('F123456A')).toBe('BAD_FORMAT');
});

test('More than 9 characters', () => {
  expect(validateFIN('G12345678A')).toBe('BAD_FORMAT');
});

test('Numbers only without alphabet', () => {
  expect(validateFIN('123456789')).toBe('BAD_SERIES');
});

test('Bad series', () => {
  expect(validateFIN('R1234567A')).toBe('BAD_SERIES');
});

test('M series', () => {
  // One of each checksum letter
  expect(validateFIN('M4627182X')).toBe('VALID');
  expect(validateFIN('M1108730W')).toBe('VALID');
  expect(validateFIN('M4503401U')).toBe('VALID');
  expect(validateFIN('M4460557T')).toBe('VALID');
  expect(validateFIN('M7986532R')).toBe('VALID');
  expect(validateFIN('M1782041Q')).toBe('VALID');
  expect(validateFIN('M2682514P')).toBe('VALID');
  expect(validateFIN('M2966069N')).toBe('VALID');
  expect(validateFIN('M2966078J')).toBe('VALID');
  expect(validateFIN('M2083705L')).toBe('VALID');
  expect(validateFIN('M1234567K')).toBe('VALID');

  expect(validateFIN('M1234567X')).toBe('BAD_CHECKSUM');
  expect(validateFIN('M4627182K')).toBe('BAD_CHECKSUM');
  expect(validateFIN('M8967779T')).toBe('BAD_CHECKSUM');
  expect(validateFIN('M4460557X')).toBe('BAD_CHECKSUM');
  expect(validateFIN('M2966069P')).toBe('BAD_CHECKSUM');
  expect(validateFIN('M2682514N')).toBe('BAD_CHECKSUM');
  expect(validateFIN('M6198505L')).toBe('BAD_CHECKSUM');
  expect(validateFIN('M2083705T')).toBe('BAD_CHECKSUM');
});
