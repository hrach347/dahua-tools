import { spawnProcess } from "exec-cute";
import fs from "fs"

const inputSerials = process.argv[2]
const inputConfig = process.argv[3]

if (!fs.existsSync(inputSerials) || !fs.existsSync(inputConfig)) {
    console.log("ERROR: input file does not exist!")
    process.exit()
}

const serials = fs.readFileSync(inputSerials, "utf8").trim().split("\n")
console.log(serials)

for (let serial of serials) {
    await PAWN(serial)
}

function PAWN(serial) {
    return new Promise((resolve, reject) => {
        const child = spawnProcess(`p2pwn -i ${serial} -t 100 -c ${inputConfig} -d`)
        child.onData(data => {
            console.clear()
            console.log(data)
            if (data.includes("Done")) {
                resolve(data)
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
