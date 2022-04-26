import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { EmailValidation } from '../../../presentation/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/validators/required-field-validation'
import { Validation } from '../../../presentation/validators/validation'
import { ValidationComposite } from '../../../presentation/validators/validation-composite'
import { makeLoginValidation } from './login-validation'

jest.mock('../../../presentation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const fields = ['email', 'password']
    const validations: Validation[] = []
    for (const field of fields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
