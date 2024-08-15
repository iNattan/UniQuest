import { Prisma, Competition } from '@prisma/client'

export interface CompetitionsRepository {
  findById(id: number): Promise<Competition | null>
  findMany(filter?: string): Promise<Competition[]>
  create(data: Prisma.CompetitionCreateInput): Promise<Competition>
  update(id: number, data: Prisma.CompetitionUpdateInput): Promise<Competition>
  delete(id: number): Promise<boolean>
}
