import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { CompareFieldsValidation } from '../../../presentation/validators/compare-fields-validation'
import { EmailValidation } from '../../../presentation/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/validators/required-field-validation'
import { Validation } from '../../../presentation/validators/validation'
import { ValidationComposite } from '../../../presentation/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../../presentation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    const validations: Validation[] = []
    for (const field of fields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
