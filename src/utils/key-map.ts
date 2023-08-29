export class KeyMap<T> {
  m: Map<T, void>;

  constructor() {
    this.m = new Map();
  }

  add(key: T) {
    return this.m.set(key, null);
  }

  has(key: T): boolean {
    return this.m.has(key);
  }

  delete(key: any): boolean {
    return this.m.delete(key);
  }
}
