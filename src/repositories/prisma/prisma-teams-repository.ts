import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { TeamsRepository } from '../teams-repository'

export class PrismaTeamsRepository implements TeamsRepository {
  async findById(id: number) {
    const team = await prisma.team.findUnique({
      where: {
        id,
      },
    })

    return team
  }

  async findMany(filter?: string) {
    const teams = await prisma.team.findMany({
      where: {
        system_deleted: null,
        ...(filter ? { name: { contains: filter, mode: 'insensitive' } } : {}),
      },
    })

    return teams
  }

  async findByCompetitionId(competitionId: number) {
    return await prisma.team.findMany({
      where: {
        competition_id: competitionId,
      },
    })
  }

  async create(data: Prisma.TeamCreateInput) {
    const team = await prisma.team.create({
      data,
    })

    return team
  }

  async update(id: number, data: Prisma.TeamUpdateInput) {
    const team = await prisma.team.update({
      where: { id },
      data,
    })
    return team
  }

  async delete(id: number) {
    try {
      await prisma.team.update({
        where: { id },
        data: {
          system_deleted: id,
          system_date_deleted: new Date(),
        },
      })
      return true
    } catch (err) {
      return false
    }
  }
}
