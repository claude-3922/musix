export interface StateManager<T> {
  get: T;
  set: (value: T) => void;
}
