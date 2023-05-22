const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middle
app.use(cors());
app.use(express.json());

//mongodb start

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.6wlkevy.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    //start project
    //collections
    const serviceCollections = client.db("re-zanToys").collection("sevices");
    const blogsCollections = client.db("re-zanToys").collection("blogs");
    const galleryCollections = client.db("re-zanToys").collection("gallery");
    const toysCollections = client.db("re-zanToys").collection("toys");

    //serarch

    const indexKey = { toy_name: 1 };
    const indexkeyName = { name: "searchToyName" };
    const result = await toysCollections.createIndex(indexKey, indexkeyName);

    //get services data
    app.get("/services", async (req, res) => {
      const result = await serviceCollections.find().toArray();
      res.send(result);
    });

    //get gallery data
    app.get("/gallery", async (req, res) => {
      const result = await galleryCollections.find().toArray();
      res.send(result);
    });
    //get blog datas
    app.get("/blogs", async (req, res) => {
      const result = await blogsCollections.find().sort({ date: -1 }).toArray();
      res.send(result);
    });

    //toys part start
    //get data
    app.get("/toys", async (req, res) => {
      const result = await toysCollections
        .find()
        .sort({ _id: -1 })
        .limit(20)
        .toArray();
      res.send(result);
    });

    //product single page
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollections.findOne(query);
      res.send(result);
    });

    //user toys data
    app.get("/my-toys/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await toysCollections
        .find({ seller_email: req.params.email })
        .toArray();
      res.send(result);
    });

    //insert data
    app.post("/toys", async (req, res) => {
      const body = req.body;
      const result = await toysCollections.insertOne(body);
      res.send(result);
    });

    //search option
    app.get("/toys/searchBy/:text", async (req, res) => {
      const text = req.params.text;
      const result = await toysCollections
        .find({
          toy_name: { $regex: text, $options: "i" },
        })
        .toArray();
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

//testing
app.get("/", (req, res) => {
  res.send("Let make a toy market place");
});

//conntection
app.listen(port);
