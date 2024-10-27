import { TeamMembersRepository } from '@/repositories/team-members-repository'
import { TeamsRepository } from '@/repositories/teams-repository'
import { CompetitionsRepository } from '@/repositories/competitions-repository'
import { NotFoundError } from '../errors/not-found-error'

export class DeleteTeamMemberUseCase {
  constructor(
    private teamMemberRepository: TeamMembersRepository,
    private teamsRepository: TeamsRepository,
    private competitionsRepository: CompetitionsRepository,
  ) {}

  async execute(userId: number, teamId: number): Promise<boolean> {
    const teamMemberExists =
      await this.teamMemberRepository.findByUserAndTeamId(userId, teamId)

    if (!teamMemberExists) {
      throw new NotFoundError('TeamMember')
    }

    await this.teamMemberRepository.delete(teamMemberExists.id)

    const remainingMembersCount =
      await this.teamMemberRepository.countByTeamId(teamId)

    const team = await this.teamsRepository.findById(teamId)
    if (!team) {
      throw new NotFoundError('Team')
    }

    const competition = await this.competitionsRepository.findById(
      team.competition_id,
    )
    if (!competition) {
      throw new NotFoundError('Competition')
    }

    if (remainingMembersCount < competition.min_participant) {
      await this.teamsRepository.update(teamId, { status: null })
    }

    return true
  }
}
