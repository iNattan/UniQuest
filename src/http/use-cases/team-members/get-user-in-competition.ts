import { TeamMembersRepository } from '@/repositories/team-members-repository';

interface GetUserInCompetitionUseCaseRequest {
  user_id: number;
  competition_id: number;
}

interface GetUserInCompetitionUseCaseResponse {
  team_id: number | null;
}

export class GetUserInCompetitionUseCase {
  constructor(
    private teamMembersRepository: TeamMembersRepository,
  ) {}

  async execute({
    user_id,
    competition_id,
  }: GetUserInCompetitionUseCaseRequest): Promise<GetUserInCompetitionUseCaseResponse> {
    const teamId = await this.teamMembersRepository.findByUserAndCompetitionId(user_id, competition_id);

    return {
      team_id: teamId,
    };
  }
}

