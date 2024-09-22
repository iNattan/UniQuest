import { generateBracket } from '@/http/utils/bracketUtils'
import { DirectConfrontationMatchesRepository } from '@/repositories/direct-confrontation-matches-repository'
import { ScoresRepository } from '@/repositories/scores-repository'
import { DirectConfrontationMatch, Prisma } from '@prisma/client'

interface CreateDirectConfrotationMatchUseCaseRequest {
  competition_id: number
  game_id: number
  teams: number[]
}

interface CreateDirectConfrotationMatchUseCaseResponse {
  matches: DirectConfrontationMatch[]
}

export class CreateDirectConfrotationMatchUseCase {
  constructor(
    private directConfrontationMatchesRepository: DirectConfrontationMatchesRepository,
    private scoresRepository: ScoresRepository,
  ) {}

  async execute({
    competition_id,
    game_id,
    teams,
  }: CreateDirectConfrotationMatchUseCaseRequest): Promise<CreateDirectConfrotationMatchUseCaseResponse> {
    const matchesData = generateBracket(competition_id, game_id, teams)

    await this.directConfrontationMatchesRepository.createMany(matchesData)

    const scoresData: Prisma.ScoreCreateManyInput[] = teams.map((team_id) => ({
      competition_id,
      game_id,
      team_id,
      score: 0,
    }))

    await this.scoresRepository.createMany(scoresData)

    const matches =
      await this.directConfrontationMatchesRepository.findByCompetitionAndGame(
        competition_id,
        game_id,
      )

    return {
      matches,
    }
  }
}
