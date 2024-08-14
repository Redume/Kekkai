const fs = require('fs');
const config = require('../shared/config/src/main.js')();
const schedule = require('node-schedule');

function main() {
    if (config['currency']['chart']['max_size'] === 0) return;

    fs.readdir('../charts/', (err, files) => {
        if (err) return;

        let folderSize = 0;

        for (const file of files) {
            try {
                const fileSize = fs.statSync(`../charts/${file}`)['size'] / 1024;
                folderSize += fileSize;

                if (folderSize > config['currency']['chart']['max_size']) {
                    for (let i = 0; i < files.length; i++) {
                        fs.unlinkSync(`../charts/${files[i]}`);
                    }
                }
            } catch { return; }
        }
    });
}

schedule.scheduleJob('9 20 * * *', async function () {
    main();
});

main();