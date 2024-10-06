import { TeamMember, Prisma } from '@prisma/client'
import { TeamMembersRepository } from '../team-members-repository'

export class InMemoryTeamMembersRepository implements TeamMembersRepository {
  public members: TeamMember[] = []

  async findByUserAndTeamId(userId: number, teamId: number) {
    const teamMember = this.members.find(
      (member) => member.user_id === userId && member.team_id === teamId
    )

    if (!teamMember) {
      return null
    }

    return teamMember
  }

  async create(data: Prisma.TeamMemberCreateInput) {
    const teamMember: TeamMember = {
      id: this.members.length + 1,
      user_id: data.user.connect?.id as number,
      team_id: data.team.connect?.id as number,
    }

    this.members.push(teamMember)

    return teamMember
  }

  async delete(id: number) {
    const teamMemberIndex = this.members.findIndex((item) => item.id === id)

    if (teamMemberIndex === -1) {
      return false
    }

    this.members.splice(teamMemberIndex, 1)

    return true
  }
}
