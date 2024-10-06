import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteCompetitionUseCase } from './delete'
import { InMemoryCompetitionsRepository } from '@/repositories/in-memory/in-memory-competitions-repository'
import { NotFoundError } from '../errors/not-found-error'

let competitionsRepository: InMemoryCompetitionsRepository
let sut: DeleteCompetitionUseCase

describe('Delete Competition Use Case', () => {
  beforeEach(() => {
    competitionsRepository = new InMemoryCompetitionsRepository()
    sut = new DeleteCompetitionUseCase(competitionsRepository)
  })

  it('should be able to delete a competition', async () => {
    const competition = await competitionsRepository.create({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
    })

    const wasDeleted = await sut.execute(competition.id)

    expect(wasDeleted).toBe(true)
    expect(competitionsRepository.items.length).toBe(1)
    expect(competitionsRepository.items[0].system_deleted).toBe(competition.id)
  })

  it('should throw NotFoundError if competition does not exist', async () => {
    await expect(() => sut.execute(999)).rejects.toBeInstanceOf(NotFoundError)
  })
})
