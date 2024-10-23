import { describe, it, expect, beforeEach } from 'vitest'
import { GetCompetitionImagesUseCase } from './get-images'
import { InMemoryCompetitionsRepository } from '@/repositories/in-memory/in-memory-competitions-repository'

let competitionsRepository: InMemoryCompetitionsRepository
let sut: GetCompetitionImagesUseCase

describe('Get Competition Images Use Case', () => {
  beforeEach(() => {
    competitionsRepository = new InMemoryCompetitionsRepository()
    sut = new GetCompetitionImagesUseCase(competitionsRepository)
  })

  it('should be able to get competition images', async () => {
    await competitionsRepository.create({
      title: 'Competition 1',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
      image: 'image-1.png',
    })

    await competitionsRepository.create({
      title: 'Competition 2',
      date_event: new Date(),
      start_registration: new Date(),
      end_registration: new Date(),
      min_participant: 8,
      max_participant: 16,
      local: 'Local',
      image: 'image-2.png',
    })

    const { competitions } = await sut.execute()

    expect(competitions).toHaveLength(2)
    expect(competitions).toEqual([
      expect.objectContaining({ id: 1, image: 'image-1.png' }),
      expect.objectContaining({ id: 2, image: 'image-2.png' }),
    ])
  })

  it('should return an empty array if no competitions have images', async () => {
    const { competitions } = await sut.execute()

    expect(competitions).toHaveLength(0)
  })
})
