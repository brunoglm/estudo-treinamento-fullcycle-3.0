import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { EntityValidationError } from "../../domain/validators/validation.error";
import { FieldErrors } from "../../domain/validators/validator-fields-interface";

type Expected =
  | {
    validator: ClassValidatorFields<any>
    data: any
  }
  | (() => any)

expect.extend({
  containsErrorMessages(
    expected: Expected,
    received: FieldErrors,
  ) {
    if (typeof expected === 'function') {
      try {
        expected();
        return isValid()
      } catch (e) {
        const error = e as EntityValidationError
        return assertContainsErrorsMessages(error.errors, received)
      }
    } else {
      const { validator, data } = expected
      const validated = validator.validate(data)
      if (validated) {
        return isValid()
      }
      return assertContainsErrorsMessages(validator.errors, received)
    }
  }
});

function assertContainsErrorsMessages(
  expected: FieldErrors,
  received: FieldErrors,
) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected)

  if (isMatch) {
    return isValid()
  }

  return {
    pass: false,
    message: () => {
      return `The validation errors not contains ${JSON.stringify(received)}. Current: ${JSON.stringify(expected)}`
    },
  }
}

function isValid() {
  return { pass: true, message: () => '' }
}
