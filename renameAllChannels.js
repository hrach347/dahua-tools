import { run } from "exec-cute";

const { stdout: channels } = await run("node channels.js")

const channelsArr = channels.split("\n").map(el => el.split("=")[1])

console.log(channelsArr)

for (let i = 0; i < channelsArr.length; i++) {
    await run(`node renameChannel.js ${i + 1} CAM${i + 1}`)
}
