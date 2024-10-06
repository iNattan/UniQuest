import { describe, it, expect, beforeEach } from 'vitest'
import { GetCompetitionUseCase } from './get'
import { InMemoryCompetitionsRepository } from '@/repositories/in-memory/in-memory-competitions-repository'

let competitionsRepository: InMemoryCompetitionsRepository
let sut: GetCompetitionUseCase

describe('Get Competition Use Case', () => {
  beforeEach(() => {
    competitionsRepository = new InMemoryCompetitionsRepository()
    sut = new GetCompetitionUseCase(competitionsRepository)
  })

  it('should be able to get all competitions without filter', async () => {
    await competitionsRepository.create({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
    })

    await competitionsRepository.create({
      title: 'Competition 2',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
    })

    const { competitions } = await sut.execute({})

    expect(competitions).toHaveLength(2)
    expect(competitions).toEqual([
      expect.objectContaining({ title: 'Competition 1' }),
      expect.objectContaining({ title: 'Competition 2' }),
    ])
  })

  it('should be able to get competitions with a filter', async () => {
    await competitionsRepository.create({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
    })

    await competitionsRepository.create({
      title: 'Competition 2',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
    })

    const { competitions } = await sut.execute({ filter: '1' })

    expect(competitions).toHaveLength(1)
    expect(competitions).toEqual([
      expect.objectContaining({ title: 'Competition 1' }),
    ])
  })

  it('should return an empty array if no competitions match the filter', async () => {
    await competitionsRepository.create({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
    })

    const { competitions } = await sut.execute({ filter: 'NonExistingCompetition' })

    expect(competitions).toHaveLength(0)
  })
})
