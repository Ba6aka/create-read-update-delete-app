const { createServer } = require('http');
const { readFileSync, writeFileSync, readdir, readdirSync } = require('fs');
const { getDb, connectToDb, } = require('./db')
const { ObjectId } = require('mongodb')

createServer(async function (req, res) {

    if (req.method == 'GET') {
        serveFile(req.url, res)
    }
}).listen(process.env.PORT || 1337)







async function serveFile(url, res) {
    let path = url
    let file

    connectToDb((err) => {
        if (!err) {
            db = getDb()
        }
    })

    if (path == '/') {
        file = readFileSync(__dirname + '/public/' + '/index.html')
    } else if (path == '/getAllFilles') {
        let words = []

        await db.collection('CRUD')
            .find()
            .forEach(element => {
                words.push(element)
            })

        file = (JSON.stringify(words))
    }
    else {
        file = readFileSync(__dirname + '/public/' + path)
    }
    res.end(file)
}
