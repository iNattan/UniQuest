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

  async findByUserAndCompetitionId(userId: number, competitionId: number): Promise<number | null> {
    const teamMember = this.members.find(
      (member) => {
        const team = { competition_id: 1 };
        return member.user_id === userId && team.competition_id === competitionId;
      }
    );

    return teamMember ? teamMember.team_id : null;
  }
  
  async findManyByTeamId(teamId: number) {
    return this.members
      .filter((member) => member.team_id === teamId)
      .map((member) => ({
        ...member,
        user: { id: member.user_id, name: 'User Name' }, 
        team: { id: member.team_id, name: 'Team Name' },  
      }))
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
