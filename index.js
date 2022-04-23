const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(express.json());
// nodeTaker
// JZeFrKUjxoXrq4BV


const uri = "mongodb+srv://nodeTaker:JZeFrKUjxoXrq4BV@cluster0.tm3xv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const notesCollection = client.db("nodeTaker").collection("notes");
        console.log('conected to db');
        // http://localhost:5000/notes
        app.get('/notes', async (req, res) => {
            const q = req.query;
            console.log(q);
            // console.log(req);
            const cursor = notesCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        // http://localhost:5000/note
        // {body
        // "userName":"tamanna simo",
        // "textData":"hello world"
        // }
        // http://localhost:5000/note
        app.post('/note', async (req, res) => {
            const data = req.body;
            console.log('from post api', data);

            const result = await notesCollection.insertOne(data);
            res.send(result)

        })
        // update
        // http://localhost:5000/note/62642f8ad0935ab32a71df51
        app.put('/note/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log("from update api", data);
            // console.log('from put methord ', id);
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    userName: data.userName,
                    textData: data.textData
                },
            };
            const result = await notesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
            // delete

        })
        app.delete('/note/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await notesCollection.deleteOne(filter);
            res.send(result)
        })

    } finally {

    }
}
run().catch(console.dir)
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     // client.close();
//     console.log('db conected');
// });

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})