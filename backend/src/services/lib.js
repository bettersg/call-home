async function sanitizeDbErrors(asyncFunc) {
  try {
    const result = await asyncFunc();
    return result;
  } catch (e) {
    const { errors } = e;
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

module.exports = {
  sanitizeDbErrors,
};
