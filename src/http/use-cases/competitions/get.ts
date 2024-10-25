import { CompetitionsRepository } from '@/repositories/competitions-repository'
import { Competition } from '@prisma/client'

type CompetitionWithoutImageAndRegulation = Omit<Competition, 'image' | 'regulation'>

interface GetCompetitionUseCaseRequest {
  filter?: string
}

interface Game {
  id: number
  name: string
}

interface CompetitionGame {
  id: number
  local: string
  date_game: string
  competition_id: number
  game_id: number
  game?: Game
}

interface CompetitionWithGames extends CompetitionWithoutImageAndRegulation {
  CompetitionGames: CompetitionGame[]
}

interface GetCompetitionUseCaseResponse {
  competitions: CompetitionWithGames[]
}

export class GetCompetitionUseCase {
  constructor(private competitionsRepository: CompetitionsRepository) {}

  async execute({
    filter,
  }: GetCompetitionUseCaseRequest): Promise<GetCompetitionUseCaseResponse> {
    const competitions = await this.competitionsRepository.findMany(filter)

    const competitionsWithGameName = competitions.map(competition => ({
      ...competition,
      CompetitionGames: (competition as CompetitionWithGames).CompetitionGames.map(compGame => ({
        id: compGame.id,
        local: compGame.local,
        date_game: compGame.date_game,
        competition_id: compGame.competition_id,
        game_id: compGame.game_id,
        game_name: compGame.game?.name,
      })),
    }))

    return {
      competitions: competitionsWithGameName,
    }
  }
}
