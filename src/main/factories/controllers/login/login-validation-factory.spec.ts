import { EmailValidator } from '../../../../validation/protocols/email-validator'
import { Validation } from '../../../../presentation/protocols/validation'
import { makeLoginValidation } from './login-validation-factory'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../../validation/validators'

jest.mock('../../../../validation/validators/validation-composite')

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
