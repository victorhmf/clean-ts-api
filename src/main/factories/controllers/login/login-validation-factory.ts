import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../../validation/validators'

export const makeLoginValidation = (): ValidationComposite => {
  const fields = ['email', 'password']
  const validations: Validation[] = []

  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
