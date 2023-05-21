const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
    await client.connect();

    //start project
    const serviceCollections = client.db("re-zanToys").collection("sevices");
    const blogsCollections = client.db("re-zanToys").collection("blogs");

    //get services data
    app.get("/services", async (req, res) => {
      const result = await serviceCollections.find().toArray();
      res.send(result);
    });

    //get blog datas
    app.get("/blogs", async (req, res) => {
      const result = await blogsCollections.find().sort({ date: -1 }).toArray();
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
