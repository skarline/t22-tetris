import Server from "t22-server"
import UI from "./ui"

const server = new Server({
  countdown: 1
})

new UI(server)

server.addPlayer()
server.addPlayer()

server.start()
