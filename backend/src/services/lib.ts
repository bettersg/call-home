import type { ValidationError } from 'sequelize';

async function sanitizeDbErrors<T>(asyncFunc: () => Promise<T>): Promise<T> {
  try {
    const result = await asyncFunc();
    return result;
  } catch (e) {
    const { errors } = e as ValidationError;
    if (!errors) {
      // Don't know what to do, just rethrow
      throw e;
    }
    // TODO do this smarter
    throw new Error(
      `Validation Error: ${errors.map(({ message }) => message).join('\n')}`
    );
  }
}

export { sanitizeDbErrors };
