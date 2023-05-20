const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//------------Middel were -----------//
//------------Middel were -----------//
app.use(cors());
app.use(express.json());
//------------------------------------//
//-----------------------------------//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.37yfgb3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // const carCollection = client.db("vroomCarDb").collection("");
    const myCarsCollection = client.db("vroomCarDb").collection("allCars");

    // Create Index for search //
    const indexKeys = { title: 1 };
    const indexOptions = { name: "title" };

    await myCarsCollection.createIndex(indexKeys, indexOptions);


    // Search car by car name
    app.get("/toySearch/:title", async (req, res) => {
      const title = req.params.title;
      // console.log(title);
      const result = await myCarsCollection
        .find({
          name: { $regex: title, $options: "i" },
        })
        .hint("title")
        .toArray();
      res.send(result);
    });

    // Sorting all car //
    app.get("/allcars", async (req, res) => {
      const sortOrder = req.query.sort === 'asc' ? 1 : -1;
      // console.log(sortOrder);
      const result = await myCarsCollection.find().limit(20).sort({ price : sortOrder }).toArray();

      res.json(result);
    })



    // Get all cars
    app.get("/cars", async (req, res) => {
      const result = await carCollection.find().limit(20).toArray();
      res.send(result);
    });

    // get cars by sub category
    app.get("/cars/:text", async (req, res) => {
      const data = req.params.text;
      const result = await myCarsCollection
        .find({
          sub_category: req.params.text,
        })
        .limit(2)
        .toArray();
      res.send(result);
    });

    // post car on data base
    app.post("/addcar", async (req, res) => {
      const carBody = req.body;
      console.log(carBody);
      carBody.postAt = new Date();
      // console.log(postAt);
      const result = await myCarsCollection.insertOne(carBody);
      res.send(result);
    });

    // Get only login user car //
    app.get("/mycars", async (req, res) => {
      const email = req.query.email;
      // console.log(email);
      const filter = { seller_email: req.query.email };
      if (req.query.email) {
        // console.log(req.query.email, email);
        const result = await myCarsCollection
          .find({ saller_email: req.query.email })
          .toArray();
        res.send(result);
      } else {
        const result = await myCarsCollection.find({}).limit(20).toArray();
        res.send(result);
      }
      // console.log(email);
    });

    // Delete a car //
    app.delete("/deletecar/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const quary = { _id: new ObjectId(id) };
      const result = await myCarsCollection.deleteOne(quary);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
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
