import { Prisma, Competition } from '@prisma/client'
type CompetitionWithoutRegulation = Omit<Competition, 'regulation'>
type CompetitionWithoutImageAndRegulation = Omit<Competition, 'image' | 'regulation'>
type CompetitionWithIdAndImage = Pick<Competition, 'id' | 'image'>
type Regulation = Pick<Competition, 'regulation'>

export interface CompetitionsRepository {
  findById(id: number): Promise<CompetitionWithoutRegulation | null>
  findRegulationById(id: number): Promise<Regulation | null>
  findManyImages(filter?: string): Promise<CompetitionWithIdAndImage[]>
  findMany(filter?: string): Promise<CompetitionWithoutImageAndRegulation[]>
  create(data: Prisma.CompetitionCreateInput): Promise<Competition>
  update(id: number, data: Prisma.CompetitionUpdateInput): Promise<Competition>
  delete(id: number): Promise<boolean>
}
