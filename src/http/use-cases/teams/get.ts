import { TeamsRepository } from '@/repositories/teams-repository'
import { Team } from '@prisma/client'

type TeamWithoutPassword = Omit<Team, 'password_hash'>

interface GetTeamUseCaseRequest {
  competitionId: number
  filter?: string
}

interface TeamWithMembers extends TeamWithoutPassword {
  members_count: number
  max_participant: number
}

interface GetTeamUseCaseResponse {
  _count?: {
    TeamMember: number
  }
  competition?: {
    min_participant: number
    max_participant: number
  }
  teams: TeamWithMembers[]
}

export class GetTeamUseCase {
  constructor(private teamsRepository: TeamsRepository) {}

  async execute({
    competitionId,
    filter,
  }: GetTeamUseCaseRequest): Promise<GetTeamUseCaseResponse> {
    const teams = await this.teamsRepository.findMany(competitionId, filter)

    const teamsWithMembers = teams.map((team) => ({
      id: team.id,
      competition_id: team.competition_id,
      name: team.name,
      status: team.status,
      is_private: team.is_private,
      leader_user_id: team.leader_user_id,
      created_at: team.created_at,
      system_deleted: team.system_deleted,
      system_date_deleted: team.system_date_deleted,
      members_count: team._count?.TeamMember || 0,
      min_participant: team.competition?.min_participant || 0,
      max_participant: team.competition?.max_participant || 0,
    }))

    return {
      teams: teamsWithMembers,
    }
  }
}
