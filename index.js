const { serialize } = require('bson');
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wq4ks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri)

async function run() {

    try {
        await client.connect();

        const database = client.db('userBooking');
        const bookingCollection = database.collection('Booking');
        const orderCollection = database.collection("user-Booking")


        // GET API
        app.get('/bookings', async (req, res) => {
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings)
        });

        // GET Single Booking Details
        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const booking = await bookingCollection.findOne(query);
            res.json(booking)
        })

        // DELETE USER BOOKING API
        // DELETE API
        app.delete('/myOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            // console.log('deleteing User with id', result)
            res.json(result);
        })

        // DELETE ALL USER BOOKING API
        app.delete('/allEvents/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            console.log('Delete ')
            res.json(result)
        })


        // GET User BOOKING
        app.get("/myEvents/:email", async (req, res) => {
            const email = req.params.email
            const cursor = orderCollection.find({ email })
            const services = await cursor.toArray();
            res.send(services);
        });


        // GET ALL USER BOOKING
        app.get("/allEvents", async (req, res) => {
            const result = await orderCollection.find({}).toArray();
            res.send(result);
        });


        // ADD Booking API
        app.post('/userBook', async (req, res) => {
            const book = req.body;
            const result = await orderCollection.insertOne(book)
            res.json(result);
        })

        // POST API
        app.post('/bookings', async (req, res) => {
            const bookings = req.body;
            console.log(req.body);
            const result = await bookingCollection.insertOne(bookings);
            res.json(result);

        });



    }

    finally {
        // await client.close()
    }

}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Node Server Is Running')
})

app.listen(port, () => {
    console.log('Server Running', port)
})