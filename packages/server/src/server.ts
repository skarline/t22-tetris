/**
 * T22 Game Server
 *
 * the server will be responsible for the game logic
 * socket.io won't be implemented here but in the client-server architecture
 */

import Logger from "./utils/logger"
import Player from "./player"

import { v4 as uuidv4 } from "uuid"

export interface ServerOptions {
  silent?: boolean
  seed?: number
  minBagItems?: number
  maxPlayers?: number
  countdown?: number
  dropsPerSecond?: number
  playfieldWidth?: number
  playfieldHeight?: number
}

const defaultOptions: ServerOptions = {
  silent: true,
  seed: 0,
  minBagItems: 3,
  maxPlayers: 4,
  countdown: 0,
  dropsPerSecond: 1,
  playfieldWidth: 10,
  playfieldHeight: 20
}

export default class Server {
  private players: Map<string, Player> = new Map()

  constructor(public options: ServerOptions = {}) {
    this.options = {
      ...defaultOptions,
      ...options
    }
  }

  /**
   * Start the game
   */
  public start(): void {
    if (this.players.size < 1) {
      throw new Error("No players to start the game")
    }

    this.options.seed ||= this.generateSeed()

    Logger.log(
      `Starting game with seed ${this.options.seed} in ${this.options.countdown}s`
    )

    this.players.forEach((player) => {
      player.start(this.options.countdown)
    })
  }

  /**
   * Add a player to the game
   */
  public addPlayer(id: string = uuidv4()): Player {
    if (this.players.has(id)) {
      throw new Error("Player already exists")
    }

    if (this.players.size >= this.options.maxPlayers) {
      throw new Error("Server is full")
    }

    const player = new Player(id, this.options)

    this.players.set(player.id, player)

    Logger.log(`Added player ${player.id}`)

    return player
  }

  /**
   * Remove a player from the game
   */
  public removePlayer(id: string): void {
    if (!this.players.has(id)) {
      throw new Error("Player does not exist")
    }

    this.players.delete(id)

    Logger.log(`Removed player ${id}`)
  }

  /**
   * Get all players
   */
  public getPlayers(): Map<string, Player> {
    return this.players
  }

  /**
   * Get the current seed
   */
  public getSeed(): number {
    return this.options.seed
  }

  /**
   * Generate a random seed
   */
  private generateSeed(): number {
    return Math.floor(Math.random() * 1000000)
  }
}