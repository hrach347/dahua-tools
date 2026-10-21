import { run } from "exec-cute";
import dotenv from "dotenv";

dotenv.config()

const channel = process.argv[2] || 1
const channelName = process.argv[3] || "CAM"

const [username, password] = [process.env.username, process.env.password]


const { stdout: data } = await run(`curl -g --digest -u ${username}:${password} 'http://127.0.0.1:8080/cgi-bin/configManager.cgi?action=setConfig&ChannelTitle[${channel - 1}].Name=${channelName}' `)
console.log(data)

const { stdout: data2 } = await run(`curl -g --digest -u ${username}:${password} 'http://127.0.0.1:8080/cgi-bin/configManager.cgi?action=setConfig&VideoWidget[${channel - 1}].CustomTitle[1].Text=${channelName}' `)
console.log(data2)

