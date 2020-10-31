import * as z from 'zod';

export const stringToNumberTransformer = z.transformer(
  z.string().nonempty(),
  z.number(),
  (val) => {
    return +val;
  }
);
