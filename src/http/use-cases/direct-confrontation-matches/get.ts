import { DirectConfrontationMatchesRepository } from '@/repositories/direct-confrontation-matches-repository'
import { DirectConfrontationMatch } from '@prisma/client'

interface Team {
  name: string
}

interface DirectConfrontationMatchWithTeams extends DirectConfrontationMatch {
  team1?: Team
  team2?: Team
  winner_team?: Team
}

interface DirectConfrontationMatchWithTeamNames {
  id: number
  competition_id: number
  game_id: number
  game_name: string | null
  round: number
  match: number
  team1_id: number | null
  team2_id: number | null
  winner_team_id: number | null
  team1_name: string | null
  team2_name: string | null
  winner_team_name: string | null
}

interface GetDirectConfrontationMatchUseCaseRequest {
  competition_id: number
  game_id: number
}

interface GetDirectConfrontationMatchUseCaseResponse {
  directConfrontationMatches: DirectConfrontationMatchWithTeamNames[]
}

export class GetDirectConfrontationMatchUseCase {
  constructor(
    private directConfrontationMatchesRepository: DirectConfrontationMatchesRepository,
  ) {}

  async execute({
    competition_id,
    game_id,
  }: GetDirectConfrontationMatchUseCaseRequest): Promise<GetDirectConfrontationMatchUseCaseResponse> {
    const directConfrontationMatches =
      await this.directConfrontationMatchesRepository.findByCompetitionAndGame(
        competition_id,
        game_id,
      )

    const matchesWithTeamNames = directConfrontationMatches.map((match) => ({
      id: match.id,
      competition_id: match.competition_id,
      game_id: match.game_id,
      game_name: match.game?.name || null,
      round: match.round,
      match: match.match,
      team1_id: match.team1_id,
      team2_id: match.team2_id,
      winner_team_id: match.winner_team_id,
      team1_name: match.team1?.name || null,
      team2_name: match.team2?.name || null,
      winner_team_name: match.winner_team?.name || null,
    }))

    return {
      directConfrontationMatches: matchesWithTeamNames,
    }
  }
}
