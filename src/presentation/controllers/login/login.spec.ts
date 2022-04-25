import { LoginContoller } from './login'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

describe('Login Controller', () => {
  test('should return 400 if no email is provided ', async () => {
    const sut = new LoginContoller()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided ', async () => {
    const sut = new LoginContoller()
    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
