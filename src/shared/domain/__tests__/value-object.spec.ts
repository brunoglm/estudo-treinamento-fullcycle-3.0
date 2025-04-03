import { ValueObject } from '../value-object';

class StringValueObject extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
}

class ComplexValueObject extends ValueObject<{ name: string, idade: number }> {
  constructor(props: { name: string, idade: number }) {
    super(props);
  }
}

describe('ValueObject Unit Tests', () => {
  test('should be equals', () => {
    const valueObject1 = new StringValueObject('test');
    const valueObject2 = new StringValueObject('test');
    expect(valueObject1.equals(valueObject2)).toBe(true);

    const valueObject3 = new StringValueObject('test2');
    const valueObject4 = new StringValueObject('test3');
    expect(valueObject3.equals(valueObject4)).toBe(false);

    const valueObject5 = new ComplexValueObject({ name: 'test', idade: 1 });
    const valueObject6 = new ComplexValueObject({ name: 'test', idade: 1 });
    expect(valueObject5.equals(valueObject6)).toBe(true);

    const valueObject7 = new ComplexValueObject({ name: 'test1', idade: 1 });
    const valueObject8 = new ComplexValueObject({ name: 'test2', idade: 2 });
    expect(valueObject7.equals(valueObject8)).toBe(false);
  });
});

