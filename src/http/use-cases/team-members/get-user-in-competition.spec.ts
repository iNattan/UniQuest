import { describe, it, expect, beforeEach } from 'vitest';
import { GetUserInCompetitionUseCase } from './get-user-in-competition';
import { InMemoryTeamMembersRepository } from '@/repositories/in-memory/in-memory-team-members-repository';

let teamMembersRepository: InMemoryTeamMembersRepository;
let sut: GetUserInCompetitionUseCase;

describe('Get User In Competition Use Case', () => {
  beforeEach(() => {
    teamMembersRepository = new InMemoryTeamMembersRepository();
    sut = new GetUserInCompetitionUseCase(teamMembersRepository);
  });

  it('should be able to get the team id for a user in a competition', async () => {
    await teamMembersRepository.create({
      user: {
        connect: { id: 1 },
      },
      team: {
        connect: { id: 1 },
      }
    });

    const { team_id } = await sut.execute({ user_id: 1, competition_id: 1 });

    expect(team_id).toBe(1);
  });
});

