import { AllAgainstAllPlacementsRepository } from '@/repositories/all-against-all-placements-repository'
import { GamesRepository } from '@/repositories/games-repository'
import { AllAgainstAllMatchesRepository } from '@/repositories/all-against-all-matches-repository'
import { NotFoundError } from '../errors/not-found-error'

interface UpdateAllAgainstAllMatchRequest {
  match_id: number
  placements: {
    team_id: number
    position: number
  }[]
}

export class UpdateAllAgainstAllMatchUseCase {
  constructor(
    private allAgainstAllMatchesRepository: AllAgainstAllMatchesRepository,
    private allAgainstAllPlacementsRepository: AllAgainstAllPlacementsRepository,
    private gamesRepository: GamesRepository,
  ) {}

  async execute({ match_id, placements }: UpdateAllAgainstAllMatchRequest) {
    const existingMatch =
      await this.allAgainstAllMatchesRepository.findById(match_id)

    if (!existingMatch) {
      throw new NotFoundError('AllAgainstAllMatch')
    }

    const game = await this.gamesRepository.findById(existingMatch.game_id)

    if (!game) {
      throw new NotFoundError('Game')
    }

    for (const placement of placements) {
      let score = 0

      const existingPlacements =
        await this.allAgainstAllPlacementsRepository.findByMatchIdAndTeamId(
          match_id,
          placement.team_id,
        )

      if (!existingPlacements) {
        throw new NotFoundError('AllAgainstAllPlacement')
      }

      if (placement.position === 1) {
        score = game.first_score
      } else if (placement.position === 2) {
        score = game.second_score
      } else if (placement.position === 3) {
        score = game.third_score
      } else {
        score = game.general_score
      }

      await this.allAgainstAllPlacementsRepository.update(
        existingPlacements.id,
        {
          position: placement.position,
          score,
        },
      )
    }
  }
}
