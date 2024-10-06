import { DirectConfrontationMatch, Prisma } from '@prisma/client'
import { DirectConfrontationMatchesRepository } from '../direct-confrontation-matches-repository'

export class InMemoryDirectConfrontationMatchesRepository implements DirectConfrontationMatchesRepository {
  public items: DirectConfrontationMatch[] = []

  async findByCompetitionAndGame(competitionId: number, gameId: number) {
    return this.items.filter(
      (item) => item.competition_id === competitionId && item.game_id === gameId,
    )
  }

  async findByRoundAndMatch(
    competitionId: number,
    gameId: number,
    round: number,
    match: number,
  ) {
    const matchFound = this.items.find(
      (item) =>
        item.competition_id === competitionId &&
        item.game_id === gameId &&
        item.round === round &&
        item.match === match,
    )
    return matchFound || null
  }

  async findById(id: number) {
    const match = this.items.find((item) => item.id === id)
    return match || null
  }

  async createMany(data: Prisma.DirectConfrontationMatchCreateManyInput[]) {
    const newMatches: DirectConfrontationMatch[] = data.map((item, index) => ({
      id: this.items.length + 1 + index,
      competition_id: item.competition_id,
      game_id: item.game_id,
      round: item.round,
      match: item.match,
      team1_id: item.team1_id ?? null, 
      team2_id: item.team2_id ?? null, 
      winner_team_id: item.winner_team_id ?? null,
      created_at: new Date(),
    }))

    this.items.push(...newMatches)

    return { count: newMatches.length }
  }

  async update(id: number, data: Prisma.DirectConfrontationMatchUpdateInput) {
    const matchIndex = this.items.findIndex((item) => item.id === id)

    if (matchIndex === -1) {
      throw new Error('Match not found')
    }

    const existingMatch = this.items[matchIndex]
    const updatedMatch: DirectConfrontationMatch = {
      ...existingMatch,
      team1_id: data.team1 ? data.team1.connect?.id ?? existingMatch.team1_id : existingMatch.team1_id,
      team2_id: data.team2 ? data.team2.connect?.id ?? existingMatch.team2_id : existingMatch.team2_id,
      winner_team_id: data.winner_team ? data.winner_team.connect?.id ?? existingMatch.winner_team_id : existingMatch.winner_team_id,
      round: typeof data.round === 'number' ? data.round : existingMatch.round,
      match: typeof data.match === 'number' ? data.match : existingMatch.match,
    }
    

    this.items[matchIndex] = updatedMatch
    return updatedMatch
  }

  async deleteMany(competitionId: number, gameId: number) {
    const initialLength = this.items.length
    this.items = this.items.filter(
      (item) => item.competition_id !== competitionId || item.game_id !== gameId,
    )
    return this.items.length < initialLength
  }
}
