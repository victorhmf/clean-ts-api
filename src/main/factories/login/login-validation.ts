import { ValidationComposite } from '../../../presentation/validators/validation-composite'
import { RequiredFieldValidation } from '../../../presentation/validators/required-field-validation'
import { Validation } from '../../../presentation/validators/validation'
import { EmailValidation } from '../../../presentation/validators/email-validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const fields = ['email', 'password']
  const validations: Validation[] = []

  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
