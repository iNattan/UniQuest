import lodash from 'lodash'

function shuffleArray(array: number[]): number[] {
  return lodash.shuffle(array)
}

function isPowerOfTwo(n: number): boolean {
  return (n & (n - 1)) === 0
}

function calculateByes(teamsCount: number): number {
  if (isPowerOfTwo(teamsCount)) {
    return 0
  }

  let nextPowerOfTwo = 1
  while (nextPowerOfTwo < teamsCount) {
    nextPowerOfTwo *= 2
  }

  return nextPowerOfTwo - teamsCount
}

interface Match {
  competition_id: number
  game_id: number
  round: number
  match: number
  team1_id: number | null
  team2_id: number | null
  winner_team_id: number | null
}

export function generateBracket(
  competition_id: number,
  game_id: number,
  teamIds: number[],
): Match[] {
  const shuffledTeams = shuffleArray(teamIds)

  const matches: Match[] = []
  let round = 1
  let matchNumber = 1

  const numByes = calculateByes(shuffledTeams.length)

  for (let i = 0; i < numByes; i++) {
    matches.push({
      competition_id,
      game_id,
      round,
      match: matchNumber,
      team1_id: shuffledTeams[i],
      team2_id: null,
      winner_team_id: shuffledTeams[i],
    })
    matchNumber++
  }

  for (let i = numByes; i < shuffledTeams.length; i += 2) {
    if (shuffledTeams[i] !== null || shuffledTeams[i + 1] !== null) {
      matches.push({
        competition_id,
        game_id,
        round,
        match: matchNumber,
        team1_id: shuffledTeams[i],
        team2_id: shuffledTeams[i + 1],
        winner_team_id: null,
      })
      matchNumber++
    }
  }

  while (matches.filter((m) => m.round === round).length > 1) {
    round++
    const previousRoundMatches = matches.filter(
      (match) => match.round === round - 1,
    )
    matchNumber = 1

    for (let i = 0; i < previousRoundMatches.length; i += 2) {
      const team1 = previousRoundMatches[i]?.winner_team_id
      const team2 = previousRoundMatches[i + 1]?.winner_team_id

      matches.push({
        competition_id,
        game_id,
        round,
        match: matchNumber,
        team1_id: team1,
        team2_id: team2,
        winner_team_id: null,
      })
      matchNumber++
    }
  }

  return matches
}
