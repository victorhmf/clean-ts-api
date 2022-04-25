import { Authentication } from '../../../domain/use-cases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginContoller implements Controller {
  private readonly emailValidator
  private readonly authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return badRequest(new MissingParamError('email'))
      }
      if (!password) {
        return badRequest(new MissingParamError('password'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) return badRequest(new InvalidParamError('email'))

      await this.authentication.auth(email, password)

      return await new Promise(resolve => resolve({
        body: {},
        statusCode: 200
      }))
    } catch (error) {
      return serverError(error)
    }
  }
}
