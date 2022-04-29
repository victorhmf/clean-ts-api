import { DbAuthentication } from './db-authentication'
import {
  AccountModel,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'ane_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      const account: AccountModel = makeFakeAccount()

      return await new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new EncrypterStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeUpdateAccesstokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccesstokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new UpdateAccesstokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const updateAccessTokenRepositoryStub = makeUpdateAccesstokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeFakeAuthentication())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throws if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throws if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should return null if Hashcomparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuthentication())

    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throws if HashComparer throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should return a token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBe('any_token')
  })

  test('Should call UpdateAcessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(makeFakeAuthentication())

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throws if UpdateAcessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow(new Error())
  })
})
