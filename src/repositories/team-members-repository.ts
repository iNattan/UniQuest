import { Prisma, TeamMember } from '@prisma/client'
interface TeamMemberWithNames {
  id: number
  user_id: number
  team_id: number
  user: {
    name: string
  }
  team: {
    name: string
  }
}

export interface TeamMembersRepository {
  findByUserAndTeamId(
    userId: number,
    teamId: number,
  ): Promise<TeamMember | null>
  findByUserAndCompetitionId(
    userId: number,
    competitionId: number,
  ): Promise<number | null>
  findManyByTeamId(teamId: number): Promise<TeamMemberWithNames[]>
  create(data: Prisma.TeamMemberCreateInput): Promise<TeamMember>
  delete(id: number): Promise<boolean>
}
