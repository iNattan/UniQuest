import { TeamsRepository } from '@/repositories/teams-repository'
import { Team } from '@prisma/client'

type TeamWithoutPassword = Omit<Team, 'password_hash'>

interface GetTeamsForApprovalUseCaseRequest {
  competitionId: number
}

interface TeamWithMembers extends TeamWithoutPassword {
  members_count: number
  max_participant: number
}

interface GetTeamsForApprovalUseCaseResponse {
  _count?: {
    TeamMember: number
  }
  competition?: {
    max_participant: number
  }
  teams: TeamWithMembers[]
}

export class GetTeamsForApprovalUseCase {
  constructor(private teamsRepository: TeamsRepository) {}

  async execute({
    competitionId,
  }: GetTeamsForApprovalUseCaseRequest): Promise<GetTeamsForApprovalUseCaseResponse> {
    const teams =
      await this.teamsRepository.findManyForApprovalByCompetitionId(
        competitionId,
      )

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
      max_participant: team.competition?.max_participant || 0,
      message: team.message,
    }))

    return {
      teams: teamsWithMembers,
    }
  }
}
