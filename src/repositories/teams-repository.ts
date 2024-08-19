import { Prisma, Team } from '@prisma/client'

export interface TeamsRepository {
  findById(id: number): Promise<Team | null>
  findMany(filter?: string): Promise<Team[]>
  create(data: Prisma.TeamCreateInput): Promise<Team>
  update(id: number, data: Prisma.TeamUpdateInput): Promise<Team>
  delete(id: number): Promise<boolean>
}
