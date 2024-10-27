import { Prisma, Team } from '@prisma/client'
type TeamWithoutPassword = Omit<Team, 'password_hash'>

export interface TeamsRepository {
  findById(id: number): Promise<Team | null>
  findMany(
    competitionId: number,
    filter?: string,
  ): Promise<TeamWithoutPassword[]>
  findManyRegisteredByCompetitionId(competitionId: number): Promise<Team[]>
  findManyForApprovalByCompetitionId(competitionId: number): Promise<Team[]>
  findByCompetitionId(competitionId: number): Promise<Team[]>
  create(data: Prisma.TeamCreateInput): Promise<Team>
  update(id: number, data: Prisma.TeamUpdateInput): Promise<Team>
  delete(id: number): Promise<boolean>
}
