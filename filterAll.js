import fs from "fs"
import { run } from "exec-cute"


const inputFolder = process.argv[2]


if (!fs.existsSync(inputFolder)) {
    console.log("Folder does not exist")
    process.exit()
}

const folders = fs.readdirSync(inputFolder)
for (let folder of folders) {
    const { stdout, stderr } = await run(`node filter.js ${inputFolder + "/" + folder}`)
    console.log(stdout || stderr)
}