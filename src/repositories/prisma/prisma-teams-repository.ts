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

  async findMany(competitionId: number, filter?: string) {
    const teams = await prisma.team.findMany({
      where: {
        system_deleted: null,
        competition_id: competitionId,
        OR: [{ status: { not: -1 } }, { status: null }],
        ...(filter
          ? {
              name: {
                contains: filter,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      select: {
        id: true,
        competition_id: true,
        name: true,
        status: true,
        is_private: true,
        leader_user_id: true,
        created_at: true,
        system_deleted: true,
        system_date_deleted: true,
        _count: {
          select: {
            TeamMember: true,
          },
        },
        competition: {
          select: {
            max_participant: true,
          },
        },
        message: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return teams
  }

  async findManyRegisteredByCompetitionId(competitionId: number) {
    const teams = await prisma.team.findMany({
      where: {
        competition_id: competitionId,
        status: 1,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return teams
  }

  async findManyForApprovalByCompetitionId(competitionId: number) {
    const teams = await prisma.team.findMany({
      where: {
        competition_id: competitionId,
        status: { not: null },
      },
      select: {
        id: true,
        competition_id: true,
        name: true,
        status: true,
        is_private: true,
        leader_user_id: true,
        created_at: true,
        system_deleted: true,
        system_date_deleted: true,
        _count: {
          select: {
            TeamMember: true,
          },
        },
        competition: {
          select: {
            max_participant: true,
          },
        },
        message: true,
      },
      orderBy: {
        name: 'asc',
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
