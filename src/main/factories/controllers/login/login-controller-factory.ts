import { makeLoginValidation } from './login-validation-factory'
import { Controller } from '../../../../presentation/protocols'
import { LoginContoller } from '../../../../presentation/controllers/login/login/login-controller'
import { makeDbAuthentication } from '../../use-cases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginContoller(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
