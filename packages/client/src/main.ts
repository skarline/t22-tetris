import Server from "t22-server"

const local = new Server({
  silent: false,
  countdown: 1
})

const id = local.addPlayer()

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      local.dispatch(id, "move", -1)
      break
    case "ArrowRight":
      local.dispatch(id, "move", 1)
      break
    case "ArrowDown":
      local.dispatch(id, "down")
      break
    case "ArrowUp":
      local.dispatch(id, "rotate")
      break
    case " ":
      local.dispatch(id, "drop")
      break
    case "Shift":
      local.dispatch(id, "hold")
      break
  }
})

local.start()
