import { CompetitionsRepository } from '@/repositories/competitions-repository'
import { Competition, CompetitionGame } from '@prisma/client'
import { NotFoundError } from '../errors/not-found-error'
import { CompetitionGamesRepository } from '@/repositories/competition-games-repository'

interface UpdateCompetitionGamesUseCaseRequest {
  local: string
  date_game: Date
  game_id: number
}

interface UpdateCompetitionUseCaseRequest {
  id: number
  title?: string
  date_event?: Date
  start_registration?: Date
  end_registration?: Date
  min_participant?: number
  max_participant?: number
  local?: string
  description?: string
  CompetitionGames?: Array<UpdateCompetitionGamesUseCaseRequest>
}

interface UpdateCompetitionUseCaseResponse {
  competition: Competition
  competitionGames: CompetitionGame[]
}

export class UpdateCompetitionUseCase {
  constructor(
    private competitionRepository: CompetitionsRepository,
    private competitionGamesRepository: CompetitionGamesRepository,
  ) {}

  async execute({
    id,
    title,
    date_event,
    start_registration,
    end_registration,
    min_participant,
    max_participant,
    local,
    description,
    CompetitionGames,
  }: UpdateCompetitionUseCaseRequest): Promise<UpdateCompetitionUseCaseResponse> {
    const competitionExists = await this.competitionRepository.findById(id)

    if (!competitionExists) {
      throw new NotFoundError('Competition')
    }

    const competition = await this.competitionRepository.update(id, {
      title,
      date_event,
      start_registration,
      end_registration,
      min_participant,
      max_participant,
      local,
      description,
    })

    let competitionGames: CompetitionGame[] = []
    if (CompetitionGames) {
      await this.competitionGamesRepository.deleteByCompetitionId(id)

      const competitionGamesData = CompetitionGames.map((game) => ({
        competition_id: id,
        game_id: game.game_id,
        local: game.local,
        date_game: game.date_game,
      }))

      await this.competitionGamesRepository.createMany(competitionGamesData)

      competitionGames =
        await this.competitionGamesRepository.findByCompetitionId(id)
    } else {
      competitionGames =
        await this.competitionGamesRepository.findByCompetitionId(id)
    }

    return {
      competition,
      competitionGames,
    }
  }
}
