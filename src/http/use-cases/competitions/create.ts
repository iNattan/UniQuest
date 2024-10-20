import { CompetitionGamesRepository } from '@/repositories/competition-games-repository'
import { CompetitionsRepository } from '@/repositories/competitions-repository'
import { Competition, CompetitionGame } from '@prisma/client'

interface CreateCompetitionGamesUseCaseRequest {
  local: string
  date_game: Date
  game_id: number
}

interface CreateCompetitionUseCaseRequest {
  title: string
  date_event: Date
  start_registration: Date
  end_registration: Date
  min_participant: number
  max_participant: number
  local: string
  description?: string
  CompetitionGames?: Array<CreateCompetitionGamesUseCaseRequest>
  image?: string
  regulation?: string
}

interface CreateCompetitionUseCaseResponse {
  competition: Competition
  competitionGames: CompetitionGame[]
}

export class CreateCompetitionUseCase {
  constructor(
    private competitionRepository: CompetitionsRepository,
    private competitionGamesRepository: CompetitionGamesRepository,
  ) {}

  async execute({
    title,
    date_event,
    start_registration,
    end_registration,
    min_participant,
    max_participant,
    local,
    description,
    CompetitionGames,
    image,
    regulation,
  }: CreateCompetitionUseCaseRequest): Promise<CreateCompetitionUseCaseResponse> {
    const competition = await this.competitionRepository.create({
      title,
      date_event,
      start_registration,
      end_registration,
      min_participant,
      max_participant,
      local,
      description,
      image,
      regulation,
    })

    let competitionGames: CompetitionGame[] = []
    if (CompetitionGames) {
      const competitionGamesData = CompetitionGames.map((game) => ({
        competition_id: competition.id,
        game_id: game.game_id,
        local: game.local,
        date_game: game.date_game,
      }))

      this.competitionGamesRepository.createMany(competitionGamesData)

      competitionGames =
        await this.competitionGamesRepository.findByCompetitionId(
          competition.id,
        )
    }
    return {
      competition,
      competitionGames,
    }
  }
}
