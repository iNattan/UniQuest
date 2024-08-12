import { Prisma, Game } from '@prisma/client'

export interface GamesRepository {
  findById(id: number): Promise<Game | null>
  findMany(filter?: string): Promise<Game[]>
  create(data: Prisma.GameCreateInput): Promise<Game>
  update(id: number, data: Prisma.GameUpdateInput): Promise<Game>
  delete(id: number): Promise<boolean>
}
