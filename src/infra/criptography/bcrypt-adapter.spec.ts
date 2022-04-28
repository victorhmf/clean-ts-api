import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hash'),
  compare: jest.fn().mockResolvedValue(true)
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter ', () => {
  test('should call hash with correct values', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const sut = makeSut()
    await sut.hash('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return a valid hash on hash success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_value')

    expect(hash).toBe('hash')
  })

  test('should throws if bcrypt throws', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })

    const sut = makeSut()
    const promise = sut.hash('any_value')

    await expect(promise).rejects.toThrow(new Error())
  })

  test('should call compare with correct values', async () => {
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    const sut = makeSut()
    await sut.compare('any_value', 'any_hash')

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('should return true when compare succeeds', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')

    expect(isValid).toBeTruthy()
  })

  test('should return false when compare fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)
    const isValid = await sut.compare('any_value', 'any_hash')

    expect(isValid).toBeFalsy()
  })
})
