/**
 * T22 Tetris game
 *
 * Game client entry point
 */

import Server, { PlayerJoinEvent } from "t22-server"

// import UI from "./ui"

/**
 * (THIS IS A PROTOTYPE)
 *
 * We should start by creating a server instance,
 * and then render the game.
 */

// const ui = new UI()

const server = new Server()

server.events.subscribe("player-joined", (event: PlayerJoinEvent) => {
  console.log(`Player ${event.slot} joined`)
})

server.addPlayer()

server.start()
