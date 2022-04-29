export interface UpdateAccessTokenRepository {
  updateAcesstoken: (id: string, token: string) => Promise<void>
}
