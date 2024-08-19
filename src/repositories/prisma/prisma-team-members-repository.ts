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
