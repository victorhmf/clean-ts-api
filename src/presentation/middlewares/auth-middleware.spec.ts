import { forbidden } from '../helpers/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/use-cases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'

const makeFakeAccount = (): AccountModel => (
  {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_mail@mail.com',
    password: 'hashed_password'
  }
)

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    class LoadAccountBytokenStub implements LoadAccountByToken {
      async load (accessToken: string, role?: string): Promise<AccountModel | null> {
        return await new Promise(resolve => resolve(makeFakeAccount()))
      }
    }

    const loadAccountByTokenStub = new LoadAccountBytokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct accessToken', async () => {
    class LoadAccountBytokenStub implements LoadAccountByToken {
      async load (accessToken: string, role?: string): Promise<AccountModel | null> {
        return await new Promise(resolve => resolve(makeFakeAccount()))
      }
    }

    const loadAccountByTokenStub = new LoadAccountBytokenStub()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    await sut.handle({
      headers: {
        'x-access-token': 'any-token'
      }
    })

    expect(loadSpy).toHaveBeenCalledWith('any-token')
  })
})
