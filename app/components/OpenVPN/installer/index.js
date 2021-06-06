const { exec } = require(`child_process`)

module.exports = () => 
    new Promise((resolve, reject) => {
        const command = `${__dirname}/tap-windows-9.21.1.exe`
        exec(command, (err, stdout, stderr) => {
            if (err) {
                return reject();
            }
            resolve()
        });
    })