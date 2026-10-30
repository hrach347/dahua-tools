import { run } from "exec-cute"
import fs from "fs"

const inputFolder = process.argv[2]
const country = process.argv[3]

if (!fs.existsSync(inputFolder)) {
    console.log("Folder does not exist")
    process.exit()
}

if (!country) {
    console.log("Provide valid country code!")
    process.exit()
}

const folders = fs.readdirSync(inputFolder)

const newFolderName = country + "_from_" + inputFolder.replace(/[/.\\,]/g, "")
fs.mkdirSync(newFolderName)
fs.mkdirSync(newFolderName + "/snapshots")
fs.writeFileSync(newFolderName + "/addresses.txt", "")

for (let folder of folders) {
    try {
        await run(`cp ${inputFolder + folder}/FILTERED/${country}-snapshots/* ${newFolderName}/snapshots/`)

        const jsonData = JSON.parse(fs.readFileSync(`${inputFolder + folder}/FILTERED/${country}.json`, "utf8"))
        let stringData = ""
        for (let device of jsonData) {
            stringData += `SN: ${device.serial}, IP: ${device.ip}, login: ${device.login}, password: ${device.password} \n`
        }

        fs.writeFileSync(`${newFolderName}/temp.txt`, stringData, { flag: 'a' })
    } catch (error) {
        // console.log(error.message)
    }
}

await run(`awk '!seen[$0]++' ${newFolderName}/temp.txt > ${newFolderName}/addresses.txt`)
await run(`rm ${newFolderName}/temp.txt`)

console.log(`Took every ${country} from ${inputFolder} and put in ${newFolderName} !`)