import { Action } from "./actions"

import { Vector2 } from "./lib/math"

export interface PartialGameEvent {
  slot: number
}

export type MatchEvent = "player-join" | "player-leave" | "start"
export type GameEvent =
  | "next-piece"
  | "piece-rotate"
  | "piece-lock"
  | "piece-move"
  | "piece-move-collision"
  | "line-clear"

export type ControllerEvent = "action-pressed" | "action-released"

export type Event = MatchEvent | GameEvent | ControllerEvent

export interface MatchEventMap {
  "player-join": { slot: number }
  "player-leave": { slot: number }
  "start": {}
}

export interface GameEventMap {
  "next-piece": { data: string; position: Vector2 }
  "piece-rotate": { rotation: number }
  "piece-lock": { data: string; position: Vector2 }
  "piece-move": { position: Vector2 }
  "piece-move-collision": { direction: Vector2 }
  "line-clear": { lines: number[] }
}

export interface DetailedGameEventMap {
  [key: string]: PartialGameEvent & GameEventMap[keyof GameEventMap]
}

export interface ControllerEventMap {
  "action-pressed": { slot: number; action: Action }
  "action-released": { slot: number; action: Action }
}

export interface EventMap extends MatchEventMap, GameEventMap, ControllerEventMap {}

export type EventSubscriberMap = {
  [K in keyof EventMap]: (args: EventMap[K]) => void
}
