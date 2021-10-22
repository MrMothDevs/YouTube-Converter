const express = require('express')
const path = require('path');
const fs = require('fs');
const ytdl = require('ytdl-core');
require('dotenv').config()

const Utils = require("./utils");

const app = express()
const port = process.env.PORT || 3000

app.use('/data', express.static(path.join(__dirname, 'data')));
app.use(express.static(__dirname+"/public"))

console.log(__dirname)

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});

// download and convert song with selected bitrate
// every download request creates session directory that gets deleted after a minute
app.get('/download', async (req, res) => {
    console.log('download started')

    const sessionDir = `data/${req.query.sessionID}/`
    setTimeout(() => {
        fs.rmdirSync(sessionDir, { recursive: true });
    }, 180 * 1000)

    let info = req.query;
    info["songPath"] = sessionDir+info.filename;
    info["sessionDir"] = sessionDir;

    await Utils.downloadSong(info, res)
})

// get song info
app.get('/getInfo', async (req, res) => {
    console.log('looking for song');
    const info = await Utils.getInfo(req.query.url);
    console.log('song found');

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.json(info);
})
