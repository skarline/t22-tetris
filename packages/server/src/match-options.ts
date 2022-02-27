interface GameOptions {
  seed: number
  countdown: number
  initialLevel: number
  matrixWidth: number
  matrixHeight: number
}

export default interface MatchOptions {
  silent: boolean
  minPlayers: number
  maxPlayers: number
  game: GameOptions
}
