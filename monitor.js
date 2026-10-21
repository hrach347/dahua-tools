import { spawnProcess } from "exec-cute"
import dotenv from "dotenv"
dotenv.config()

const serial = process.argv[2]
const port = process.argv[3] || 1440
const channel = Number(process.argv[4] || 1);
const [username, password] = [process.env.username, process.env.password]

const child = spawnProcess(`npx dahua-p2p tunnel ${serial} -l ${port}`)
child.onData((data) => {
    if (data.includes("tunnel ready")) {
        console.log(data)

        const ff = spawnProcess(`ffplay -rtsp_transport tcp rtsp://${username}:${password}@127.0.0.1:${port}/cam/realmonitor?channel=${channel}&subtype=0`)
        ff.onData(data => {
            //console.log(data)
        })

        setTimeout(() => {
            const httpTunnel = spawnProcess(`npx dahua-p2p tunnel ${serial} -l 8080 -r 80`)
            httpTunnel.onData((data) => {
                console.log(data)
                if (data.includes("tunnel ready")) {
                    console.log(data)
                }
            })
        }, 1000)
    }
})


