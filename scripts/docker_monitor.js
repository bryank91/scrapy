const execSync = require('child_process').execSync;
// check if there is any exited docker containers in quiet mode
const output = execSync('docker ps --filter "status=exited" --filter "status=dead" -q', { encoding: 'utf-8' }); 

// splits into arrays easily accessible
const parsed = output.trim().split("\n")

parsed.forEach((p) => {
    if (p.length > 1) {
        execSync(`docker start ${p}`, { encoding: 'utf-8' }); 
        console.log(`Starting up ${p}`)
    }
})