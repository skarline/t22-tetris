import Logger from "./utils/logger"
import Random from "./utils/random"

import Game from "./engine/game"

import EventBus from "./event-bus"
import { EventMap } from "./events"

import { Action } from "./actions"

import _ from "lodash"

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export interface MatchOptions {
  isHost: boolean
  silent: boolean
  minPlayers: number
  maxPlayers: number
  game: {
    seed: number
    countdown: number
    initialLevel: number
    matrixWidth: number
    matrixHeight: number
  }
}

const defaultOptions: MatchOptions = {
  isHost: false,
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

type MatchConstructorOptions = DeepPartial<MatchOptions>

export default class Match {
  private playersSlots: Player[] = []

  public bus = new EventBus()

  public options: MatchOptions

  constructor() {
    // The @ symbol is used here as a placeholder for the events coming from
    // outside the match class. (e.g. the worker in the client)
    const handlers = {
      "@setup": this.setup,
      "@start": this.start,
      "@player-join": this.onPlayerJoin,
      "@player-leave": this.onPlayerLeave,
      "@action-pressed": this.onActionPressed,
      "@action-released": this.onActionReleased
    }

    Object.entries(handlers).forEach(([event, callback]) => {
      this.bus.on(event, callback.bind(this))
    })
  }

  public setup(options: MatchConstructorOptions) {
    this.options = _.defaultsDeep(options, defaultOptions)
    this.options.game.seed ||= this.getRandomSeed()

    Logger.silent = this.options.silent

    this.bus.post("setup", this.options)
  }

  private start(): void {
    const { seed, countdown } = this.options.game

    const players = this.getPlayers()

    if (players.length < this.options.minPlayers) {
      throw new Error("Not enough players to start the game")
    }

    for (const player of players) {
      player.game.countdown()
    }

    this.bus.post("start")

    Logger.log(`Starting game with seed ${seed} in ${countdown}s`)
  }

  public getPlayers(): Player[] {
    return this.playersSlots.filter((player) => player.game)
  }

  private onPlayerJoin(args: { slot: number }): void {
    const { slot } = args

    if (slot >= this.options.maxPlayers || this.getPlayers()[slot]) {
      throw new Error(`Slot ${slot} is not available`)
    }

    // Create a game instance
    const game = new Game(this, slot)

    this.playersSlots[slot] = { game }

    Logger.log(`P${slot} joined the game`)
  }

  public onPlayerLeave(args: EventMap["player-leave"]): void {
    const { slot } = args

    this.playersSlots = this.getPlayers().splice(slot, 1)
  }

  private onActionPressed(slot: number, action: Action): void {
    const player = this.playersSlots[slot]

    player.game?.notifyControllerActionPressed(action)
  }

  private onActionReleased(slot: number, action: Action): void {
    const player = this.getPlayers()[slot]

    player.game?.notifyControllerActionReleased(action)
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
  private getRandomSeed(): number {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  }
}
