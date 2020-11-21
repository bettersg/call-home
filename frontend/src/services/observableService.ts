// A simple implementation of a service that can emit state updates.
// Each service should be instantiated by the root component as a singleton. Think of this service as a lighter form of redux.
// The intention is that this observable service can hold any piece of state that must be kept in sync with the backend.
// When the backend is interacted with, this service updates and notifies the root component appropriately.

type Observer<S> = (state: S) => any;

// TODO This doesn't clean up observers
export default class ObservableService<S> {
  state: S;

  observers: Observer<S>[];

  constructor() {
    this.state = {} as S;
    this.observers = [];
  }

  subscribe(callback: Observer<S>): void {
    this.observers.push(callback);
  }

  notify(): void {
    this.observers.forEach((observer) => observer(this.state));
  }
}
