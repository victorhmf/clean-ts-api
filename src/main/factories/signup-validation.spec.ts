import { RequiredFieldValidation } from '../../presentation/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('should call ValidationComposite with all validation', () => {
    makeSignUpValidation()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('name'),
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new RequiredFieldValidation('passwordConfirmation')
    ])
  })
})
