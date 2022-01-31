export class ErrorWithCode extends Error {
  code: string

  constructor(code: string) {
    super(code)
    this.name = 'ErrorWithCode'
    this.code = code
  }
}
