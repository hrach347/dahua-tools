import { run } from "exec-cute";
import dotenv from "dotenv";

dotenv.config()
const [username, password] = [process.env.username, process.env.password]


const { stdout } = await run(`curl --digest -u ${username}:${password} 'http://127.0.0.1:8080/cgi-bin/ptz.cgi?action=start&channel=0&code=Up&arg1=0&arg2=4&arg3=0' `)

console.log(stdout)