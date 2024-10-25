import { AllAgainstAllMatchesRepository } from '@/repositories/all-against-all-matches-repository'
import { AllAgainstAllMatch } from '@prisma/client'

interface GetAllAgainstAllMatchUseCaseRequest {
  competition_id: number
  game_id: number
}

interface Team {
  id: number
  name: string
}

interface AllAgainstAllPlacement {
  id: number
  match_id: number
  team_id: number
  team?: Team
  position: number
  score: number
}

interface AllAgainstAllMatchWithPlacements extends AllAgainstAllMatch {
  AllAgainstAllPlacement: AllAgainstAllPlacement[]
}

interface GetAllAgainstAllMatchUseCaseResponse {
  allAgainstAllMatches: AllAgainstAllMatchWithPlacements[]
}

export class GetAllAgainstAllMatchUseCase {
  constructor(
    private allAgainstAllMatchesRepository: AllAgainstAllMatchesRepository,
  ) {}

  async execute({
    competition_id,
    game_id,
  }: GetAllAgainstAllMatchUseCaseRequest): Promise<GetAllAgainstAllMatchUseCaseResponse> {
    const allAgainstAllMatches =
      await this.allAgainstAllMatchesRepository.findByCompetitionAndGame(
        competition_id,
        game_id,
      )

    const allAgainstAllMatchesWithPlacements = allAgainstAllMatches.map(
      (match) => {
        const placements =
          (match as AllAgainstAllMatchWithPlacements).AllAgainstAllPlacement ||
          []
        return {
          ...(match as AllAgainstAllMatchWithPlacements),
          AllAgainstAllPlacement: placements.map(
            (placement: AllAgainstAllPlacement) => ({
              id: placement.id,
              match_id: placement.match_id,
              team_id: placement.team_id,
              position: placement.position,
              score: placement.score,
              team_name: placement.team?.name,
            }),
          ),
        }
      },
    )

    return {
      allAgainstAllMatches: allAgainstAllMatchesWithPlacements,
    }
  }
}
