const { createServer } = require('http');
const { readFileSync, writeFileSync, readdir, readdirSync } = require('fs');
const { getDb, connectToDb, } = require('./db')
const { ObjectId } = require('mongodb');
const { url } = require('inspector');

createServer(async function (req, res) {
    switch (req.method) {
        case ('GET'):
            serveFile(req.url, res)
            break
        case ('POST'):
            postFile(req, res)
            break
        case ('DELETE'):
            deleteWord(req, res)
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

function postFile(req, res) {
    if (req.method == 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        connectToDb((err) => {

            if (!err) {

                db = getDb()
                console.log(body)
                db.collection('CRUD')
                    .insertOne(JSON.parse(body))
                    .then((word) => {
                        res.end(JSON.stringify(word))
                    })
            }
        })
    }

}

function deleteWord(req, res) {
    const id = req.url.split('/')[2]

    connectToDb((err) => {
        if (!err) {
            db = getDb()

            db.collection('CRUD')
                .deleteOne({ _id: new ObjectId(id) })
                .then((word) => {
                    res.end(JSON.stringify(word))
                })
        }
    })
}
