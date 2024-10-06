import { Team, Prisma } from '@prisma/client'
import { TeamsRepository } from '../teams-repository'

export class InMemoryTeamsRepository implements TeamsRepository {
  public items: Team[] = []

  async findById(id: number) {
    const team = this.items.find((item) => item.id === id)

    if (!team) {
      return null
    }

    return team
  }

  async findMany(filter?: string) {
    const filteredTeams = this.items.filter((team) => {
      const isActive = team.system_deleted === null || team.system_deleted === undefined

      if (!isActive) {
        return false
      }

      if (!filter) {
        return true
      }

      const matchesName = team.name.toLowerCase().includes(filter.toLowerCase())

      return matchesName
    })

    return filteredTeams
  }

  async findByCompetitionId(competitionId: number) {
    return this.items.filter(
      (team) => team.competition_id === competitionId && (team.system_deleted === null || team.system_deleted === undefined)
    )
  }

  async create(data: Prisma.TeamCreateInput) {
    const team: Team = {
      id: this.items.length + 1,
      name: data.name,
      status: data.status ?? null,
      is_private: data.is_private,
      password_hash: data.password_hash ?? null,
      competition_id: data.competition.connect?.id as number,
      leader_user_id: data.leader.connect?.id as number,
      created_at: new Date(),
      system_deleted: null,
      system_date_deleted: null,
    }

    this.items.push(team)

    return team
  }

  async update(id: number, data: Prisma.TeamUpdateInput) {
    const teamIndex = this.items.findIndex((item) => item.id === id)

    if (teamIndex === -1) {
      throw new Error('Team not found')
    }

    const existingTeam = this.items[teamIndex]

    const updatedStatus =
    typeof data.status === 'object' && data.status !== null
      ? (data.status as Prisma.NullableIntFieldUpdateOperationsInput).set ?? existingTeam.status
      : data.status ?? existingTeam.status

    const updatedTeam: Team = {
      ...existingTeam,
      name: typeof data.name === 'string' ? data.name : existingTeam.name,
      status: updatedStatus,
      is_private: typeof data.is_private === 'number' ? data.is_private : existingTeam.is_private,
      password_hash:
        typeof data.password_hash === 'string' ? data.password_hash : existingTeam.password_hash,
      competition_id:
        data.competition?.connect?.id !== undefined
          ? data.competition.connect.id
          : existingTeam.competition_id,
      leader_user_id:
        data.leader?.connect?.id !== undefined ? data.leader.connect.id : existingTeam.leader_user_id,
    }

    this.items[teamIndex] = updatedTeam

    return updatedTeam
  }

  async delete(id: number) {
    const teamIndex = this.items.findIndex((item) => item.id === id)

    if (teamIndex === -1) {
      return false
    }

    const team = this.items[teamIndex]

    this.items[teamIndex] = {
      ...team,
      system_deleted: id,
      system_date_deleted: new Date(),
    }

    return true
  }
}
