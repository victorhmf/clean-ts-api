import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationComposite, RequiredFieldValidation } from '../../../../validation/validators'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const fields = ['question', 'answers']
  const validations: Validation[] = []
  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
