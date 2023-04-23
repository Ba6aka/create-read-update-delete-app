const { createServer } = require('http');
const { readFileSync, writeFileSync, readdir, readdirSync } = require('fs');

//! Create and listen server
createServer(async function (req, res) {
    if (req.method == 'GET') {
        serveFile(req.url, res)
    }
}).listen(process.env.PORT || 1337)


function serveFile(url, res) {
    let path = url
    let file
    if (path == '/') {
        file = readFileSync(__dirname + '/public/' + '/index.html')
    } else {
        file = readFileSync(__dirname + '/public' + path)
    }
    res.end(file)
}