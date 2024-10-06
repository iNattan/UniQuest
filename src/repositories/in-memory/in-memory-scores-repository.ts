import { Score, Prisma } from '@prisma/client'
import { ScoresRepository } from '../scores-repository'

export class InMemoryScoresRepository implements ScoresRepository {
  public items: Score[] = []

  async findByCompetitionIdAndGameIdAndTeamId(
    competitionId: number,
    gameId: number,
    teamId: number,
  ) {
    const score = this.items.find(
      (item) =>
        item.competition_id === competitionId &&
        item.game_id === gameId &&
        item.team_id === teamId,
    )

    return score || null
  }

  async createMany(data: Prisma.ScoreCreateManyInput[]) {
    const newScores: Score[] = data.map((item, index) => ({
      id: this.items.length + 1 + index,
      competition_id: item.competition_id,
      game_id: item.game_id,
      team_id: item.team_id,
      score: item.score,
      created_at: new Date(),
    }))

    this.items.push(...newScores)
    return { count: newScores.length }
  }

  async update(id: number, score: number) {
    const scoreIndex = this.items.findIndex((item) => item.id === id)

    if (scoreIndex === -1) {
      throw new Error('Score not found')
    }

    const updatedScore = {
      ...this.items[scoreIndex],
      score,
    }

    this.items[scoreIndex] = updatedScore

    return updatedScore
  }

  async updateForAllTeams(
    competitionId: number,
    gameId: number,
    score: number,
  ) {
    this.items = this.items.map((item) => {
      if (item.competition_id === competitionId && item.game_id === gameId) {
        return { ...item, score }
      }
      return item
    })
  }

  async deleteMany(competitionId: number, gameId: number) {
    const initialLength = this.items.length
    this.items = this.items.filter(
      (item) =>
        !(item.competition_id === competitionId && item.game_id === gameId),
    )

    return this.items.length < initialLength
  }
}
