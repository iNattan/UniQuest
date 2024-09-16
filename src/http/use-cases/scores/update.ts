import { ScoresRepository } from '@/repositories/scores-repository'
import { GamesRepository } from '@/repositories/games-repository'
import { DirectConfrontationMatchesRepository } from '@/repositories/direct-confrontation-matches-repository'
import { AllAgainstAllMatchesRepository } from '@/repositories/all-against-all-matches-repository'
import { AllAgainstAllPlacementsRepository } from '@/repositories/all-against-all-placements-repository'
import { NotFoundError } from '../errors/not-found-error'

interface UpdateScoresUseCaseRequest {
  competition_id: number
  game_id: number
}

interface UpdateScoresUseCaseResponse {
  success: boolean
}

export class UpdateScoresUseCase {
  constructor(
    private scoresRepository: ScoresRepository,
    private gamesRepository: GamesRepository,
    private directConfrontationMatchesRepository: DirectConfrontationMatchesRepository,
    private allAgainstAllMatchesRepository: AllAgainstAllMatchesRepository,
    private allAgainstAllPlacementsRepository: AllAgainstAllPlacementsRepository,
  ) {}

  async execute({
    competition_id,
    game_id,
  }: UpdateScoresUseCaseRequest): Promise<UpdateScoresUseCaseResponse> {
    const game = await this.gamesRepository.findById(game_id)

    if (!game) {
      throw new NotFoundError('Game')
    }

    await this.scoresRepository.updateForAllTeams(
      competition_id,
      game_id,
      game.general_score,
    )

    let firstTeamId: number | null = null
    let secondTeamId: number | null = null
    let thirdTeamId: number | null = null

    if (game.category === 0) {
      const directMatches =
        await this.directConfrontationMatchesRepository.findByCompetitionAndGame(
          competition_id,
          game_id,
        )

      const lastRound = Math.max(...directMatches.map((m) => m.round))

      const lastRoundMatches = directMatches.filter(
        (match) => match.round === lastRound,
      )

      for (const match of lastRoundMatches) {
        if (match.winner_team_id) {
          if (match.match === 1) {
            firstTeamId = match.winner_team_id

            secondTeamId =
              match.team1_id === match.winner_team_id
                ? match.team2_id
                : match.team1_id
          } else {
            thirdTeamId = match.winner_team_id
          }
        }
      }
    } else {
      const allAgainstAllMatches =
        await this.allAgainstAllMatchesRepository.findByCompetitionAndGame(
          competition_id,
          game_id,
        )

      const totalScoresByTeam: { [teamId: number]: number } = {}

      for (const match of allAgainstAllMatches) {
        const placements =
          await this.allAgainstAllPlacementsRepository.findByMatchId(match.id)

        for (const placement of placements) {
          if (!totalScoresByTeam[placement.team_id]) {
            totalScoresByTeam[placement.team_id] = 0
          }
          totalScoresByTeam[placement.team_id] += placement.score
        }
      }

      const sortedTeams = Object.entries(totalScoresByTeam)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        .map(([team_id, score]) => ({ team_id: Number(team_id), score }))

      if (sortedTeams.length > 0) firstTeamId = sortedTeams[0].team_id
      if (sortedTeams.length > 1) secondTeamId = sortedTeams[1].team_id
      if (sortedTeams.length > 2) thirdTeamId = sortedTeams[2].team_id
    }

    if (firstTeamId) {
      const scoreFirst =
        await this.scoresRepository.findByCompetitionIdAndGameIdAndTeamId(
          competition_id,
          game_id,
          firstTeamId,
        )
      if (!scoreFirst) {
        throw new NotFoundError('Score')
      }
      await this.scoresRepository.update(scoreFirst.id, game.first_score)
    }

    if (secondTeamId) {
      const scoreSecond =
        await this.scoresRepository.findByCompetitionIdAndGameIdAndTeamId(
          competition_id,
          game_id,
          secondTeamId,
        )
      if (!scoreSecond) {
        throw new NotFoundError('Score')
      }
      await this.scoresRepository.update(scoreSecond.id, game.second_score)
    }

    if (thirdTeamId) {
      const scoreThird =
        await this.scoresRepository.findByCompetitionIdAndGameIdAndTeamId(
          competition_id,
          game_id,
          thirdTeamId,
        )
      if (!scoreThird) {
        throw new NotFoundError('Score')
      }
      await this.scoresRepository.update(scoreThird.id, game.third_score)
    }

    return {
      success: true,
    }
  }
}
