import { CompetitionsRepository } from '@/repositories/competitions-repository'
import { Competition } from '@prisma/client'

type CompetitionWithoutRegulation = Omit<Competition, 'regulation'>

interface GetCompetitionByIdUseCaseRequest {
  id: number
}

interface Game {
  id: number
  category: number
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

interface CompetitionWithGames extends CompetitionWithoutRegulation {
  CompetitionGames: CompetitionGame[]
}

interface GetCompetitionByIdUseCaseResponse {
  competition: CompetitionWithGames | null
}

export class GetCompetitionByIdUseCase {
  constructor(private competitionsRepository: CompetitionsRepository) {}

  async execute({
    id,
  }: GetCompetitionByIdUseCaseRequest): Promise<GetCompetitionByIdUseCaseResponse> {
    const competition = await this.competitionsRepository.findById(id)

    if (!competition) {
      return { competition: null }
    }

    const competitionWithGameName = {
      ...competition as CompetitionWithGames,
      CompetitionGames: (competition as CompetitionWithGames).CompetitionGames 
        ? (competition as CompetitionWithGames).CompetitionGames.map(compGame => ({
            id: compGame.id,
            local: compGame.local,
            date_game: compGame.date_game,
            competition_id: compGame.competition_id,
            game_id: compGame.game_id,
            game_name: compGame.game?.name,
            game_category: compGame.game?.category, 
          }))
        : [], 
    }

    return {
      competition: competitionWithGameName,
    }
  }
}
