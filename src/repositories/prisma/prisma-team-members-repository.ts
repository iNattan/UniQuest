import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { TeamMembersRepository } from '../team-members-repository'

export class PrismaTeamMembersRepository implements TeamMembersRepository {
  async findByUserAndTeamId(userId: number, teamId: number) {
    return await prisma.teamMember.findFirst({
      where: {
        user_id: userId,
        team_id: teamId,
      },
    })
  }

  async findByUserAndCompetitionId(
    userId: number,
    competitionId: number,
  ): Promise<number | null> {
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        user_id: userId,
        team: {
          competition_id: competitionId,
        },
      },
      select: {
        team_id: true,
      },
    })

    return teamMember ? teamMember.team_id : null
  }

  async findManyByTeamId(teamId: number) {
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        team_id: teamId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        team: {
          select: {
            name: true,
          },
        },
      },
    })

    return teamMembers
  }

  async countByTeamId(teamId: number) {
    const count = await prisma.teamMember.count({
      where: {
        team_id: teamId,
      },
    })
    return count
  }

  async create(data: Prisma.TeamMemberCreateInput) {
    const teamMember = await prisma.teamMember.create({
      data,
    })

    return teamMember
  }

  async delete(id: number) {
    try {
      await prisma.teamMember.delete({
        where: { id },
      })
      return true
    } catch (err) {
      return false
    }
  }
}
