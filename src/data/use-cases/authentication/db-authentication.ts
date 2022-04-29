import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly encrypter: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)

    if (account) {
      const { password: HashedPassword, id } = account
      const isValid = await this.hashComparer.compare(password, HashedPassword)

      if (isValid) {
        const accessToken = await this.encrypter.encrypt(id)
        await this.updateAccessTokenRepository.updateAcesstoken(account.id, accessToken)

        return accessToken
      }
    }

    return null
  }
}
