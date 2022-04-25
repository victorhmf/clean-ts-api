import { ValidationComposite } from '../../presentation/validators/validation-composite'
import { RequiredFieldValidation } from '../../presentation/validators/required-field-validation'
import { Validation } from '../../presentation/validators/validation'

export const makeSignUpValidation = (): ValidationComposite => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation']

  const validations: Validation[] = fields.map(field => new RequiredFieldValidation(field))

  return new ValidationComposite(validations)
}
