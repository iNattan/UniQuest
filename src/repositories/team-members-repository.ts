import { Prisma, TeamMember } from '@prisma/client'

export interface TeamMembersRepository {
  findByUserAndTeamId(
    userId: number,
    teamId: number,
  ): Promise<TeamMember | null>
  create(data: Prisma.TeamMemberCreateInput): Promise<TeamMember>
  delete(id: number): Promise<boolean>
}
