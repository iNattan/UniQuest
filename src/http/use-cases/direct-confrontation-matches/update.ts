import { DirectConfrontationMatchesRepository } from '@/repositories/direct-confrontation-matches-repository'
import { DirectConfrontationMatch } from '@prisma/client'
import { NotFoundError } from '../errors/not-found-error'

interface UpdateDirectConfrontationMatchUseCaseRequest {
  id: number
  winner_team_id: number
}

interface UpdateDirectConfrontationMatchUseCaseResponse {
  match: DirectConfrontationMatch
}

export class UpdateDirectConfrontationMatchUseCase {
  constructor(
    private directConfrontationMatchRepository: DirectConfrontationMatchesRepository,
  ) {}

  async execute({
    id,
    winner_team_id,
  }: UpdateDirectConfrontationMatchUseCaseRequest): Promise<UpdateDirectConfrontationMatchUseCaseResponse> {
    const directConfrontationMatchExists =
      await this.directConfrontationMatchRepository.findById(id)

    if (!directConfrontationMatchExists) {
      throw new NotFoundError('DirectConfrontationMatch')
    }

    const match = await this.directConfrontationMatchRepository.update(id, {
      winner_team: {
        connect: { id: winner_team_id },
      },
    })

    const nextRound = match.round + 1
    const isEvenMatch = match.match % 2 === 0
    const targetMatchNumber = Math.ceil(match.match / 2)

    const nextMatch =
      await this.directConfrontationMatchRepository.findByRoundAndMatch(
        match.competition_id,
        match.game_id,
        nextRound,
        targetMatchNumber,
      )

    if (nextMatch) {
      const updateData = isEvenMatch
        ? { team2: { connect: { id: winner_team_id } } }
        : { team1: { connect: { id: winner_team_id } } }

      await this.directConfrontationMatchRepository.update(
        nextMatch.id,
        updateData,
      )
    }

    return {
      match,
    }
  }
}
