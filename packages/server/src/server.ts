/**
 * T22 Game Server
 *
 * the server will be responsible for the game logic
 * socket.io won't be implemented here but in the client-server architecture
 */

import Logger from "./utils/logger"
import Random from "./utils/random"
import EventBus from "./event-bus"
import Game from "./engine/game"

import { v4 as uuidv4 } from "uuid"

import { Tetromino } from "./engine/types"

import { PieceLockEvent } from "./events"

export * from "./engine/types"
export * from "./events"

export interface ServerOptions {
  silent: boolean
  seed: number
  minPlayers: number
  maxPlayers: number
  countdown: number
  initialLevel: number
  matrixWidth: number
  matrixHeight: number
}

export interface ServerOptionsArgs {
  silent?: boolean
  seed?: number
  minPlayers?: number
  maxPlayers?: number
  countdown?: number
  initialLevel?: number
  matrixWidth?: number
  matrixHeight?: number
}

const defaultOptions: ServerOptions = {
  silent: true,
  seed: 0,
  minPlayers: 1,
  maxPlayers: 2,
  countdown: 0,
  initialLevel: 10,
  matrixWidth: 10,
  matrixHeight: 20
}

export type PlayerAction =
  | "left"
  | "right"
  | "down"
  | "rotate-right"
  | "rotate-left"
  | "drop"
  | "hold"

export interface ActionEvent {
  player: string
  type: PlayerAction
}

interface Player {
  game: Game
}

export default class Server {
  public players: Player[] = []

  private eventBus: EventBus = new EventBus()

  public get events(): EventBus {
    return this.eventBus
  }

  public options: ServerOptions

  constructor(optionsArgs: ServerOptionsArgs = {}) {
    this.options = {
      ...defaultOptions,
      ...optionsArgs
    }

    this.options.seed ||= this.generateSeed()

    Logger.silent = this.options.silent
  }

  /**
   * Start the game
   */
  public start(): void {
    const { minPlayers, seed, countdown } = this.options

    if (this.playersLength < minPlayers) {
      throw new Error("Not enough players to start the game")
    }

    Logger.log(`Starting game with seed ${seed} in ${countdown}s`)

    this.players.forEach((player) => {
      player.game.start()
    })
  }

  public get playersLength(): number {
    return this.players.filter((player) => player).length
  }

  /**
   * Add a player to the game
   */
  public addPlayer(index: number = this.players.length): void {
    if (index >= this.options.maxPlayers) {
      throw new Error("Server is full")
    }

    if (this.players[index]) {
      throw new Error(`Slot ${index} is already taken`)
    }

    const game = new Game(index, this.options, this.eventBus)

    this.players[index] = { game }

    Logger.log(`P${index} joined the game`)

    this.eventBus.dispatch("player-joined", {
      slot: index
    })
  }

  /**
   * Remove a player from the game
   */
  public removePlayer(index: number): void {
    this.players = this.players.splice(index, 1)

    Logger.log(`P${index} left the game`)
  }

  /**
   * Get all players
   */
  public getPlayers(): Player[] {
    return this.players
  }

  /**
   * Get the current seed
   */
  public getSeed(): number {
    return this.options.seed
  }

  /**
   * Returns a instance of the random class with the current seed
   *
   * This is intended to be used for unit testing and challenge-solving
   * with the online server, this way we ensure that the same numbers will
   * be generated for all the players.
   */
  public requestRandomGenerator(): Random {
    return new Random(this.options.seed)
  }

  /**
   * Generate a random seed
   */
  private generateSeed(): number {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  }
}
