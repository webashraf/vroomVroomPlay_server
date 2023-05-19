const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()


//------------Middel were -----------//
//------------Middel were -----------//
app.use(cors());
app.use(express.json());
//------------------------------------//
//-----------------------------------//




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mjqzlpi.mongodb.net/?retryWrites=true&w=majority1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const carCollection = client.db("vroomCarDb").collection("cars");
    const carsCollection = client.db("carVroomDb").collection("vroomCars")

    // Get all cars
    app.get("/cars", async (req,  res) =>{
      const result = await carCollection.find().limit(20).toArray();
      res.send(result)
    })
    // get cars by sub category
    app.get("/cars/:text", async (req,  res) =>{
      const data = req.params.text;
      // console.log(data);
      // const data  = req.headers.category;
      // console.log(data);
      const result = await carCollection.find({sub_categories: req.params.text}).limit(2).toArray();
      res.send(result)
    })

    // post car on data base
    app.post('/addcar', async (req, res) => {
      const carBody = req.body;
      console.log(carBody);
      const result = await carsCollection.insertOne(carBody);
      res.send(result);
    })

    app.get('/mycars', async(req, res) => {
      const email = req.query.email;
      const filter = {seller_email : email}
      const result = await carsCollection.find(filter).toArray();
      // console.log(email);
      res.send(result);
    })

    app.delete('/deletecar/:id', async(req, res) => {
      const id = req.params.id;
      // console.log(id);
      const quary = {_id: new ObjectId(id)};
      const result = await carsCollection.deleteOne(quary);
      res.send(result)
    })
















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


















app.get("/", (req, res) => {
    res.send("<h1>TOY MARKETPLACE IS RUNING</h1>");
  });
  
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });