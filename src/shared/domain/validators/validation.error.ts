import { FieldErrors } from "./validator-fields-interface";

export class EntityValidationError extends Error {
  constructor(public errors: FieldErrors, message: string = "Entity validation error") {
    super(message);
    this.name = EntityValidationError.name;
  }

  count() {
    return Object.keys(this.errors).length;
  }
}
