import { Tetromino } from "./engine/types"

export interface PlayerJoinEvent {
  slot: number
}

export interface PieceLockEvent {
  tetromino: Tetromino
  position: {
    x: number
    y: number
  }
  clearedLines: number[]
}

export interface PieceMoveEvent {
  position: {
    x: number
    y: number
  }
}
