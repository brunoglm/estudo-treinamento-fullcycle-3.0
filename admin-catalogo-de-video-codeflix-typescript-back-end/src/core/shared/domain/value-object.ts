import isEqual from 'lodash/isEqual';

export abstract class ValueObject<T> {
  private readonly _value: T;

  constructor(value: T) {
    this._value = value;
  }

  get value(): T {
    return this._value;
  }

  equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (other.constructor.name !== this.constructor.name) {
      return false;
    }

    return isEqual(other, this)
  }
}
