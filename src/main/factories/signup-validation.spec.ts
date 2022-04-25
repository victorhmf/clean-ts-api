import { CompareFieldsValidation } from '../../presentation/validators/compare-fields-validation'
import { RequiredFieldValidation } from '../../presentation/validators/required-field-validation'
import { Validation } from '../../presentation/validators/validation'
import { ValidationComposite } from '../../presentation/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('should call ValidationComposite with all validation', () => {
    makeSignUpValidation()
    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    const validations: Validation[] = []

    for (const field of fields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
