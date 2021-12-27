import Server, { Action } from "t22-server"

const server = new Server({
  silent: false,
  countdown: 1
})

const player = server.addPlayer()

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      player.handleAction(Action.LEFT)
      break
    case "ArrowRight":
      player.handleAction(Action.RIGHT)
      break
    case "ArrowDown":
      player.handleAction(Action.DROP)
      break
    case "ArrowUp":
      player.handleAction(Action.ROTATE)
      break
    case " ":
      player.handleAction(Action.HARD_DROP)
      break
    case "Shift":
      player.handleAction(Action.HOLD)
      break
  }
})

server.start()
