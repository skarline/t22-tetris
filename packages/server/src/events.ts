import { Action } from "./actions"
import Piece from "./engine/piece"

import { Vector2 } from "./lib/math"

export interface PartialGameEvent {
  slot: number
}

export interface PlayerJoinEvent {}

export interface NextPieceEvent {
  piece: Piece
}

export interface PieceRotateEvent {
  rotation: number
}

export interface PieceLockEvent {
  piece: Piece
}

export interface PieceMoveEvent {
  position: Vector2
}

export interface PieceMoveCollisionEvent {
  direction: Vector2
}

export interface LineClearEvent {
  lines: number[]
}

export interface ActionPressedEvent {
  slot: number
  action: Action
}

export interface ActionReleasedEvent {
  slot: number
  action: Action
}

export type MatchEvent = "player-join" | "player-leave"
export type GameEvent =
  | "next-piece"
  | "piece-rotate"
  | "piece-lock"
  | "piece-move"
  | "piece-move-collision"
  | "line-clear"

export type ControllerEvent = "action-pressed" | "action-released"

export type Event = MatchEvent | GameEvent | ControllerEvent

export interface EventMap {
  "player-join": PlayerJoinEvent
  "next-piece": NextPieceEvent
  "piece-rotate": PieceRotateEvent
  "piece-lock": PieceLockEvent
  "piece-move": PieceMoveEvent
  "piece-move-collision": PieceMoveCollisionEvent
  "line-clear": LineClearEvent
  "action-pressed": ActionPressedEvent
  "action-released": ActionReleasedEvent
}
