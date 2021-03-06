import { forbidden, ok, serverError } from '../helpers/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken, HttpRequest, AccountModel } from './auth-middleware-protocols'

declare interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeFakeAccount = (): AccountModel => (
  {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_mail@mail.com',
    password: 'hashed_password'
  }
)

const makeFakeRequest = (): HttpRequest => (
  {
    headers: {
      'x-access-token': 'any-token'
    }
  }
)

const makeLoadAccountBytoken = (): LoadAccountByToken => {
  class LoadAccountBytokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel | null> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountBytokenStub()
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountBytoken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeFakeRequest())

    expect(loadSpy).toHaveBeenCalledWith('any-token', role)
  })

  test('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })

  test('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())

    await expect(httpResponse).toEqual(serverError(new Error()))
  })
})
