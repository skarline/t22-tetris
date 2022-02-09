import { Tetromino } from "./engine/types"

import Piece from "./engine/piece"

export interface PlayerJoinEvent {
  slot: number
}

export interface NextPieceEvent {
  slot: number
  piece: Piece
}

export interface PieceRotateEvent {
  slot: number
  rotation: number
}

export interface PieceLockEvent {
  slot: number
  clearedLines: number[]
  piece: Piece
}

export interface PieceMoveEvent {
  slot: number
  position: {
    x: number
    y: number
  }
}
