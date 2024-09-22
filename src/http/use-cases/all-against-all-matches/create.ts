import { AllAgainstAllMatchesRepository } from '@/repositories/all-against-all-matches-repository'
import { AllAgainstAllPlacementsRepository } from '@/repositories/all-against-all-placements-repository'
import { AllAgainstAllMatch, Prisma } from '@prisma/client'
import { ScoresRepository } from '@/repositories/scores-repository'

interface CreateAllAgainstAllMatchUseCaseRequest {
  competition_id: number
  game_id: number
  number_of_rounds: number
  teams: number[]
}

interface CreateAllAgainstAllMatchUseCaseResponse {
  matches: AllAgainstAllMatch[]
}

export class CreateAllAgainstAllMatchUseCase {
  constructor(
    private allAgainstAllMatchesRepository: AllAgainstAllMatchesRepository,
    private allAgainstAllPlacementsRepository: AllAgainstAllPlacementsRepository,
    private scoresRepository: ScoresRepository,
  ) {}

  async execute({
    competition_id,
    game_id,
    number_of_rounds,
    teams,
  }: CreateAllAgainstAllMatchUseCaseRequest): Promise<CreateAllAgainstAllMatchUseCaseResponse> {
    const matches: AllAgainstAllMatch[] = []

    for (let round = 1; round <= number_of_rounds; round++) {
      const matchData = {
        competition: { connect: { id: competition_id } },
        game: { connect: { id: game_id } },
        round,
      }

      const match = await this.allAgainstAllMatchesRepository.create(matchData)
      matches.push(match)

      const placements: Prisma.AllAgainstAllPlacementCreateManyInput[] =
        teams.map((team_id) => ({
          match_id: match.id,
          team_id,
          position: 0,
          score: 0,
        }))

      await this.allAgainstAllPlacementsRepository.createMany(placements)
    }

    const scoresData: Prisma.ScoreCreateManyInput[] = teams.map((team_id) => ({
      competition_id,
      game_id,
      team_id,
      score: 0,
    }))

    await this.scoresRepository.createMany(scoresData)

    return {
      matches,
    }
  }
}
