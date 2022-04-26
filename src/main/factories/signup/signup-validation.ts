import { ValidationComposite } from '../../../presentation/validators/validation-composite'
import { RequiredFieldValidation } from '../../../presentation/validators/required-field-validation'
import { Validation } from '../../../presentation/validators/validation'
import { CompareFieldsValidation } from '../../../presentation/validators/compare-fields-validation'
import { EmailValidation } from '../../../presentation/validators/email-validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  const validations: Validation[] = []

  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
