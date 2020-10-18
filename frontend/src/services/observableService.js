// A simple implementation of a service that can emit state updates.
// Each service should be instantiated by the root component as a singleton. Think of this service as a lighter form of redux.
// The intention is that this observable service can hold any piece of state that must be kept in sync with the backend.
// When the backend is interacted with, this service updates and notifies the root component appropriately.

// TODO This doesn't clean up observers
export default class ObservableService {
  constructor() {
    this.state = {};
    this.observers = [];
  }

  subscribe(callback) {
    this.observers.push(callback);
  }

  notify() {
    this.observers.forEach((observer) => observer(this.state));
  }
}
