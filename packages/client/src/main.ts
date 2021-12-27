import Server from "t22-server"

const server = new Server({
  silent: false,
  countdown: 1
})

const player = server.addPlayer()

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      player.handleAction(Server.Action.LEFT)

server.start()
