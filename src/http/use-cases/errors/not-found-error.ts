export class NotFoundError extends Error {
  constructor(entity: string = 'Register') {
    super(`${entity} not found.`)
  }
}
