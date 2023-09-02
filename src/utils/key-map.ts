export class KeyMap<T> {
  m: Map<T, void>;

  constructor();

  constructor(arr: T[]);

  constructor(arr?: T[]) {
    this.m = new Map();
    if (arr) arr.forEach(x => this.add(x));
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
