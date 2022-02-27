/**
 * T22 Game Server
 *
 * the server will be responsible for the game logic
 * socket.io won't be implemented here but in the client-server architecture
 */
import _ from "lodash"

import Logger from "./utils/logger"
import Random from "./utils/random"

import Game from "./engine/game"

import EventBus from "./event-bus"
import MatchOptions from "./match-options"

import { ActionPressedEvent, ActionReleasedEvent } from "./events"

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

const defaultOptions: MatchOptions = {
  silent: true,
  minPlayers: 1,
  maxPlayers: 2,
  game: {
    seed: 0,
    countdown: 0,
    initialLevel: 1,
    matrixWidth: 10,
    matrixHeight: 20
  }
}

interface Player {
  game: Game
}

export default class Match {
  private playersSlots: Player[] = []

  public eventBus: EventBus = new EventBus()

  public options: MatchOptions

  constructor(options: DeepPartial<MatchOptions> = {}) {
    this.options = _.defaultsDeep(options, defaultOptions)

    Logger.silent = this.options.silent

    if (!this.options.game.seed) {
      this.generateSeed()
    }

    this.eventBus.subscribe("action-pressed", this.onActionPressed.bind(this))
    this.eventBus.subscribe("action-released", this.onActionReleased.bind(this))
  }

  /**
   * Start the game
   */
  public start(): void {
    const { seed, countdown } = this.options.game

    if (this.players.length < this.options.minPlayers) {
      throw new Error("Not enough players to start the game")
    }

    Logger.log(`Starting game with seed ${seed} in ${countdown}s`)

    this.players.forEach((player) => player.game.countdown())
  }

  public get players(): Player[] {
    return this.playersSlots.filter((player) => player.game)
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

    const game = new Game(this, index)

    this.playersSlots[index] = { game }

    Logger.log(`P${index} joined the game`)

    this.eventBus.dispatch("player-joined", {
      slot: index
    })
  }

  /**
   * Remove a player from the game
   */
  public removePlayer(index: number): void {
    this.playersSlots = this.players.splice(index, 1)

    Logger.log(`P${index} left the game`)
  }

  /**
   * Get all players
   */
  public getPlayers(): Player[] {
    return this.players
  }

  /**
   * Returns a instance of the random class with the current seed
   *
   * This is intended to be used for unit testing and challenge-solving
   * with the online server, this way we ensure that the same numbers will
   * be generated for all the players.
   */
  public requestRandomGenerator(): Random {
    return new Random(this.options.game.seed)
  }

  /**
   * Generate a random seed
   */
  private generateSeed(): void {
    this.options.game.seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  }

  private onActionPressed(event: ActionPressedEvent): void {
    const player = this.playersSlots[event.slot]

    player.game?.notifyControllerActionPressed(event.action)
  }

  private onActionReleased(event: ActionReleasedEvent): void {
    const player = this.players[event.slot]

    player.game?.notifyControllerActionReleased(event.action)
  }
}
