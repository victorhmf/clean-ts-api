import { ValidationComposite } from '../../presentation/validators/validation-composite'
import { RequiredFieldValidation } from '../../presentation/validators/required-field-validation'
import { Validation } from '../../presentation/validators/validation'
import { CompareFieldsValidation } from '../../presentation/validators/compare-fields-validation'

export const makeSignUpValidation = (): ValidationComposite => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  const validations: Validation[] = []

  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

  return new ValidationComposite(validations)
}
