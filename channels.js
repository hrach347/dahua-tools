import { run } from "exec-cute";
import dotenv from "dotenv";

dotenv.config()
const [username, password] = [process.env.username, process.env.password]

const { stdout, stderr, err } = await run(`curl -s --digest -u ${username}:${password} 'http://127.0.0.1:8080/cgi-bin/configManager.cgi?action=getConfig&name=ChannelTitle' `)
console.log(stdout || stderr || err)