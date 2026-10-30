import geoip from "geoip-country"
import fs from "fs"
import { run } from "exec-cute"


const inputFolder = process.argv[2]
const outputFolder = inputFolder + "/FILTERED"

if (!fs.existsSync(inputFolder)) {
    console.log("ERROR: Input folder does not exist!")
    process.exit()
}

if (fs.existsSync(outputFolder)) {
    console.log("ERROR: FILTERED (output) folder exists!")
    process.exit()
}


const data = fs.readFileSync(`${inputFolder}/pwned.csv`, "utf8")

const devices = data.trim().split("\n").slice(1).map(line => {
    const fields = line.split(",");
    return {
        serial: fields[0].trim(),
        ip: fields[5].trim(),
        login: fields[2].trim(),
        password: fields[3].trim()
    }
});


const countryBased = {}

for (let device of devices) {
    const geo = geoip.lookup(device.ip).country
    if (countryBased[geo]) {
        countryBased[geo].push(device)
    }
    else {
        countryBased[geo] = [device]
    }
}

console.log(countryBased)


fs.mkdirSync(outputFolder)
fs.writeFileSync(`${outputFolder}/all.json`, JSON.stringify(countryBased))

for (let country in countryBased) {

    //arrays
    const array = countryBased[country]
    fs.writeFileSync(`${outputFolder}/${country}.json`, JSON.stringify(array))

    //snaps
    fs.mkdirSync(`${outputFolder}/${country}-snapshots`)
    await run(`cp ${array.map(device => `${inputFolder}/snapshots/` + device.serial + "*").join(" ")} ${outputFolder}/${country}-snapshots/`)
}