import { TeamsRepository } from '@/repositories/teams-repository'
import { CompetitionGamesRepository } from '@/repositories/competition-games-repository'
import { ScoresRepository } from '@/repositories/scores-repository'
import { NotFoundError } from '../errors/not-found-error'
import { GamesRepository } from '@/repositories/games-repository'

interface GetScoresUseCaseRequest {
  competition_id: number
}

interface TeamScore {
  team_id: number
  team_name: string
  scores: {
    game_id: number
    game_name: string
    score: number
  }[]
  total_score: number
}

interface GetScoresUseCaseResponse {
  ranking: TeamScore[]
}

export class GetScoresUseCase {
  constructor(
    private scoresRepository: ScoresRepository,
    private teamsRepository: TeamsRepository,
    private competitionGamesRepository: CompetitionGamesRepository,
    private gamesRepository: GamesRepository,
  ) {}

  async execute({
    competition_id,
  }: GetScoresUseCaseRequest): Promise<GetScoresUseCaseResponse> {
    const teams = await this.teamsRepository.findByCompetitionId(competition_id)
    if (!teams || teams.length === 0) {
      throw new NotFoundError('Teams')
    }

    const games =
      await this.competitionGamesRepository.findByCompetitionId(competition_id)
    if (!games || games.length === 0) {
      throw new NotFoundError('Games')
    }

    const ranking: TeamScore[] = []

    for (const team of teams) {
      let totalScore = 0
      const teamScores: {
        game_id: number
        game_name: string
        score: number
      }[] = []

      for (const game of games) {
        const score =
          await this.scoresRepository.findByCompetitionIdAndGameIdAndTeamId(
            competition_id,
            game.game_id,
            team.id,
          )

        const gameScore = score ? score.score : 0

        const gameDetails = await this.gamesRepository.findById(game.game_id)
        const gameName = gameDetails ? gameDetails.name : ''

        teamScores.push({
          game_id: game.game_id,
          game_name: gameName,
          score: gameScore,
        })

        totalScore += gameScore
      }

      ranking.push({
        team_id: team.id,
        team_name: team.name,
        scores: teamScores,
        total_score: totalScore,
      })
    }

    const sortedRanking = ranking.sort((a, b) => b.total_score - a.total_score)

    return {
      ranking: sortedRanking,
    }
  }
}
