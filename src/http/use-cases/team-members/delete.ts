import { TeamMembersRepository } from '@/repositories/team-members-repository'
import { NotFoundError } from '../errors/not-found-error'

export class DeleteTeamMemberUseCase {
  constructor(private teamMemberRepository: TeamMembersRepository) {}

  async execute(userId: number, teamId: number): Promise<boolean> {
    const teamMemberExists =
      await this.teamMemberRepository.findByUserAndTeamId(userId, teamId)

    if (!teamMemberExists) {
      throw new NotFoundError('TeamMember')
    }

    return await this.teamMemberRepository.delete(teamMemberExists.id)
  }
}
