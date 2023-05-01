const { createServer } = require('http')
const { readFileSync, } = require('fs')

const { ObjectId } = require('mongodb')

const { MongoClient } = require('mongodb')
const connectionString = 'mongodb://127.0.0.1:27017/CRUD'
const options = { serverApi: { version: '1', strict: true, deprecationErrors: true } }

async function getReady() {
    const [mongo, server] = await Promise.all([
        connetToMongoDb(),
        runServer()
    ])

    return { mongo, server }
}

function connetToMongoDb() {
    const client = new MongoClient(connectionString, options)
    client.connect()
    const words = client.db('CRUD').collection('CRUD')
    return { client, words }
}

getReady().then(handleActivity)
const { client, words } = connetToMongoDb()

function handleActivity({ mongo, server }) {
    const mHandler = makeHandler()
    server.on('request', mHandler)
}

function makeHandler() {
    return async function handler(request, response) {
        switch (request.method) {
            case 'GET':
                serveFile(request, response)
                break
            case 'POST':
                postFile(request, response)
                break
            case 'DELETE':
                deleteWord(request, response)
                break
            case 'PUT':
                updateWord(request, response)
                break
        }
    }
}



function runServer() {
    return new Promise((resolve, reject) => {
        const server = createServer()

        server.listen(1337, () => {
            console.log('server started at http://localhost:' + 1337)
            resolve(server)
        })
    })
}




// async function getReady() {
//     const [mongo, server] = await Promise.all([
//         getMongoConnect(),
//         runHttpServer()
//     ])

//     return { mongo, server }
// }

// async function runHttpServer() {
//     return new Promise((resolve, reject) => {
//         const server = createServer()

//         server.on('error', reject)
//         server.on('request', preHandleRequest)

//         server.listen(port, () => {
//             console.log('server started at http://localhost:' + port)
//             resolve(server)
//         })
//     })
// }




async function serveFile(req, res) {
    let path = req.url
    let file
    if (path == '/') {
        file = readFileSync(__dirname + '/public/' + '/index.html')

    } else if (path == '/getAllFilles') {


        file = (JSON.stringify(await words.find().toArray()))

    } else if (path.startsWith('/findOneWord')) {

        const id = req.url.split('/')[2]

        await words
            .findOne({ _id: new ObjectId(id) })
            .then((word) => {
                file = (JSON.stringify(word))
            })
    }
    else {
        file = readFileSync(__dirname + '/public/' + path)
    }
    res.end(file)
}

function postFile(req, res) {
    let body = ''

    req.on('data', chunk => {
        body += chunk.toString()
    });

    req.on('end', () => {
        words
            .insertOne(JSON.parse(body))
            .then((word) => {
                body = (JSON.parse(body))
                body._id = word.insertedId
                res.end(JSON.stringify(body))
            }
            )
    })

}

function deleteWord(req, res) {
    const id = req.url.split('/')[2]

    words
        .deleteOne({ _id: new ObjectId(id) })
        .then((word) => res.end(JSON.stringify(word)))

}

function updateWord(req, res) {
    let body = ''
    const id = req.url.split('/')[2]

    req.on('data', chunk => {
        body += chunk.toString()
    });


    req.on('end', () => {
        words
            .updateOne({ _id: new ObjectId(id) },
                { $set: JSON.parse(body) },)
            .then((word) => {
                res.end(body)
            })
            .catch((err) => console.log(err))
    })


}