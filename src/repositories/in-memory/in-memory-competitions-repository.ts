import { Competition, Prisma } from '@prisma/client'
import { CompetitionsRepository } from '../competitions-repository'

export class InMemoryCompetitionsRepository implements CompetitionsRepository {
  public items: Competition[] = []

  async findById(id: number) {
    const competition = this.items.find((item) => item.id === id)
    return competition || null
  }

  async findRegulationById(id: number) {
    const competition = this.items.find((item) => item.id === id)
    if (!competition) return null

    return { regulation: competition.regulation }
  }

  async findManyImages() {
    return this.items
      .filter((competition) => competition.system_deleted === null)
      .map((competition) => ({
        id: competition.id,
        image: competition.image,
      }))
  }

  async findMany(filter?: string) {
    return this.items
      .filter((competition) => {
        const isActive = competition.system_deleted === null
        const matchesFilter = filter
          ? competition.title.toLowerCase().includes(filter.toLowerCase())
          : true

        return isActive && matchesFilter
      })
      .map((competition) => ({
        ...competition,
        CompetitionGames: [],
      }))
  }

  async create(data: Prisma.CompetitionCreateInput) {
    const newCompetition: Competition = {
      id: this.items.length + 1,
      title: data.title,
      date_event: new Date(data.date_event ?? new Date()),
      start_registration: new Date(data.start_registration ?? new Date()),
      end_registration: new Date(data.end_registration ?? new Date()),
      min_participant: data.min_participant ?? 8,
      max_participant: data.max_participant ?? 10,
      local: data.local ?? '',
      description: data.description ?? '',
      created_at: new Date(),
      system_deleted: null,
      system_date_deleted: null,
      image: data.image ?? null,
      regulation: data.regulation ?? null,
      image_name: data.image_name ?? null,
      regulation_name: data.regulation_name ?? null,
    }

    this.items.push(newCompetition)
    return newCompetition
  }

  async update(id: number, data: Prisma.CompetitionUpdateInput) {
    const competitionIndex = this.items.findIndex((item) => item.id === id)

    if (competitionIndex === -1) {
      throw new Error('Competition not found')
    }

    const existingCompetition = this.items[competitionIndex]

    const updatedCompetition: Competition = {
      ...existingCompetition,
      title:
        typeof data.title === 'string' ? data.title : existingCompetition.title,
      date_event: data.date_event
        ? new Date(data.date_event as Date)
        : existingCompetition.date_event,
      start_registration: data.start_registration
        ? new Date(data.start_registration as Date)
        : existingCompetition.start_registration,
      end_registration: data.end_registration
        ? new Date(data.end_registration as Date)
        : existingCompetition.end_registration,
      min_participant:
        typeof data.min_participant === 'number'
          ? data.min_participant
          : existingCompetition.min_participant,
      max_participant:
        typeof data.max_participant === 'number'
          ? data.max_participant
          : existingCompetition.max_participant,
      local:
        typeof data.local === 'string' ? data.local : existingCompetition.local,
      description:
        typeof data.description === 'string'
          ? data.description
          : existingCompetition.description,
      system_deleted:
        typeof data.system_deleted === 'number'
          ? data.system_deleted
          : existingCompetition.system_deleted,
      system_date_deleted: data.system_date_deleted
        ? new Date(data.system_date_deleted as Date)
        : existingCompetition.system_date_deleted,
    }

    this.items[competitionIndex] = updatedCompetition
    return updatedCompetition
  }

  async delete(id: number) {
    const competitionIndex = this.items.findIndex((item) => item.id === id)

    if (competitionIndex === -1) {
      return false
    }

    this.items[competitionIndex] = {
      ...this.items[competitionIndex],
      system_deleted: id,
      system_date_deleted: new Date(),
    }

    return true
  }
}
