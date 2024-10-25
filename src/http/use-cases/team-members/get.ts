import { TeamMembersRepository } from '@/repositories/team-members-repository'

interface GetTeamMembersByTeamIdUseCaseRequest {
  team_id: number
}

interface TeamMemberWithDetails {
  id: number
  user_id: number
  team_id: number
  user_name: string
  team_name: string
}

interface GetTeamMembersByTeamIdUseCaseResponse {
  teamMembers: TeamMemberWithDetails[]
}

export class GetTeamMembersByTeamIdUseCase {
  constructor(
    private teamMembersRepository: TeamMembersRepository,
  ) {}

  async execute({
    team_id,
  }: GetTeamMembersByTeamIdUseCaseRequest): Promise<GetTeamMembersByTeamIdUseCaseResponse> {
    const teamMembers = await this.teamMembersRepository.findManyByTeamId(team_id)

    if (!teamMembers) {
      return { teamMembers: [] }
    }

    const teamMembersWithDetails = teamMembers.map((member) => ({
      id: member.id,
      user_id: member.user_id,
      team_id: member.team_id,
      user_name: member.user.name, 
      team_name: member.team.name, 
    }))

    return {
      teamMembers: teamMembersWithDetails,
    }
  }
}
