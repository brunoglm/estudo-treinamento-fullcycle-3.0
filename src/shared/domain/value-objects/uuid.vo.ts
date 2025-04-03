import { ValueObject } from "../value-object";
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class Uuid extends ValueObject<string> {
  constructor(value?: string) {
    super(value || uuidv4());
    this.validate();
  }

  private validate(): void {
    const isValid = uuidValidate(this.value);
    if (!isValid) {
      throw new InvalidUUIDError();
    }
  }
}

export class InvalidUUIDError extends Error {
  constructor(message?: string) {
    super(message || 'ID must be a valid UUID');
    this.name = InvalidUUIDError.name;
  }
}
