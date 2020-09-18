import EventEmitter from 'events';
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

class TypedEventEmitter<
  Event extends string,
  Payload
> extends EventEmitter.EventEmitter {
  on(event: Event, subscription: (payload: Payload) => any) {
    return super.on(event, subscription);
  }

  once(event: Event, subscription: (payload: Payload) => any) {
    return super.once(event, subscription);
  }

  emit(event: Event, payload: Payload) {
    return super.emit(event, payload);
  }
}

export { sanitizeDbErrors, TypedEventEmitter };
