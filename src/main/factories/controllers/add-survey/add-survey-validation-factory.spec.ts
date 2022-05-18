import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationComposite, RequiredFieldValidation } from '../../../../validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const fields = ['question', 'answers']
    const validations: Validation[] = []
    for (const field of fields) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
