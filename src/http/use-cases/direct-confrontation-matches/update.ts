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

    const allMatches =
      await this.directConfrontationMatchRepository.findByCompetitionAndGame(
        match.competition_id,
        match.game_id,
      )

    const lastRound = Math.max(...allMatches.map((m) => m.round))

    if (nextRound === lastRound) {
      const finalMatch =
        await this.directConfrontationMatchRepository.findByRoundAndMatch(
          match.competition_id,
          match.game_id,
          nextRound,
          1,
        )

      const thirdPlaceMatch =
        await this.directConfrontationMatchRepository.findByRoundAndMatch(
          match.competition_id,
          match.game_id,
          nextRound,
          2,
        )

      if (finalMatch) {
        const updateFinalData = isEvenMatch
          ? { team2: { connect: { id: winner_team_id } } }
          : { team1: { connect: { id: winner_team_id } } }

        await this.directConfrontationMatchRepository.update(
          finalMatch.id,
          updateFinalData,
        )
      }

      const loserTeamId =
        match.team1_id === winner_team_id ? match.team2_id : match.team1_id

      if (thirdPlaceMatch && loserTeamId !== null) {
        const updateThirdPlaceData = isEvenMatch
          ? { team2: { connect: { id: loserTeamId } } }
          : { team1: { connect: { id: loserTeamId } } }

        await this.directConfrontationMatchRepository.update(
          thirdPlaceMatch.id,
          updateThirdPlaceData,
        )
      }
    } else {
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
    }

    return {
      match,
    }
  }
}
