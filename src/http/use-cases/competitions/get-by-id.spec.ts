import { describe, it, expect, beforeEach } from 'vitest'
import { GetCompetitionByIdUseCase } from './get-by-id'
import { InMemoryCompetitionsRepository } from '@/repositories/in-memory/in-memory-competitions-repository'

let competitionsRepository: InMemoryCompetitionsRepository
let sut: GetCompetitionByIdUseCase

describe('Get Competition By Id Use Case', () => {
  beforeEach(() => {
    competitionsRepository = new InMemoryCompetitionsRepository()
    sut = new GetCompetitionByIdUseCase(competitionsRepository)
  })

  it('should be able to get a competition by id with games', async () => {
    await competitionsRepository.create({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
      description: 'Description 1',
      image: 'image-1.png',
    })

    const { competition } = await sut.execute({ id: 1 })

    expect(competition).toBeDefined()
  })

  it('should return null if competition is not found', async () => {
    const { competition } = await sut.execute({ id: 999 })

    expect(competition).toBeNull()
  })
})
