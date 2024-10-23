import { describe, it, expect, beforeEach } from 'vitest'
import { GetCompetitionRegulationUseCase } from './get-regulation'
import { InMemoryCompetitionsRepository } from '@/repositories/in-memory/in-memory-competitions-repository'

let competitionsRepository: InMemoryCompetitionsRepository
let sut: GetCompetitionRegulationUseCase

describe('Get Competition Regulation Use Case', () => {
  beforeEach(() => {
    competitionsRepository = new InMemoryCompetitionsRepository()
    sut = new GetCompetitionRegulationUseCase(competitionsRepository)
  })

  it('should be able to get a competition regulation by id', async () => {
    await competitionsRepository.create({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
      regulation: 'regulation-1.pdf',
    })

    const { regulation } = await sut.execute({ id: 1 })

    expect(regulation).toBe('regulation-1.pdf')
  })

  it('should return null if the competition does not have a regulation', async () => {
    await competitionsRepository.create({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
    })

    const { regulation } = await sut.execute({ id: 1 })

    expect(regulation).toBeNull()
  })

  it('should return null if the competition with the given id does not exist', async () => {
    const { regulation } = await sut.execute({ id: 999 })

    expect(regulation).toBeNull()
  })
})
