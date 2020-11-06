/* eslint-disable */

import validateFIN from "./VerifyFIN"

test('Valid FIN', () => {
    expect(validateFIN("F1234567N")).toBeTruthy
})

test('Lowercase first alphabet', () => {
    expect(validateFIN("f3725759K")).toBeTruthy
})

test('Lowercase last alphabet', () => {
    expect(validateFIN("G897661p")).toBeTruthy
})

test('Invalid FIN', () => {
    expect(validateFIN("G1234567A")).toBeFalsy
})

test('Less than 9 characters', () => {
    expect(validateFIN("F123456A")).toBeFalsy
})

test('More than 9 characters', () => {
    expect(validateFIN("G12345678A")).toBeFalsy
})

test('Numbers only without alphabet', () => {
    expect(validateFIN("123456789")).toBeFalsy
})