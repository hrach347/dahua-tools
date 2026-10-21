import { run, spawnProcess } from "exec-cute"

const serial = process.argv[2]

const port = 1440
let bxk = 1
const channel1 = spawnProcess(`node monitor.js ${serial} ${port} 1`)

channel1.onData(data => {
    if (bxk && data.includes("tunnel ready") && data.includes("127.0.0.1:8080")) {
        bxk = 0
        console.log("Opening rest...")
        setTimeout(async () => {
            const { stdout: channels } = await run("node channels.js")
            const length = channels.split("\n").length
            for (let i = 2; i < length; i++) {
                console.log("Opening channel " + i)
                try {
                    await openCam(serial, port + i, i)
                } catch (error) {
                    console.log("ERROR:" + error)
                    continue
                }
            }
        }, 2000)
    }
})

function openCam(serial, port, channel) {
    return new Promise((resolve, reject) => {
        const child = spawnProcess(`node monitor.js ${serial} ${port} ${channel}`)
        child.onData(data => {
            if (data.includes("tunnel ready")) {
                resolve("OK")
            }
        })
        child.on("error", () => {
            reject()
        })
        child.on("exit", () => {
            reject()
        })
    })
}