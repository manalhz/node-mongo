const MongoClient = require("mongodb").MongoClient;
const assert = require("assert").strict;

const url = "mongodb://localhost:27017/";
//port number at which the server is running: 27017
const dbname = "nucampsite";
//assign name of database - this name was assigned by mongo repl

//MongoClient.connect = connects to mongodb server. client object connects to nucampsite db;
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  //the first argument (err) is actual value we're checking;
  //the second argument (null) is what we're checking against, to see if err is strictly equal to null.
  //if they match, we continue on; else, the assert will fail
  //When an assert fails, it will throw an error and terminate the entire app and log to console the error that occurred.
  assert.strictEqual(err, null);

  console.log("Connected correctly to server");

  const db = client.db(dbname);

  //dropping a collection from a database means deleting it
  //first argument is the name of the collection, second is callback with err and result as arguments;
  db.dropCollection("campsites", (err, result) => {
    assert.strictEqual(err, null);
    console.log("Dropped Collection", result);
  });

  const collection = db.collection("campsites");

  //insert new collection to db;
  collection.insertOne(
    { name: "Breadcrumb Trail Campground", description: "Test" },
    (err, result) => {
      assert.strictEqual(err, null);
      console.log("Insert Document:", result.ops);
      //ops = operations, can contain different values; in this case, the array that's inserted.
      //the toArray method will change it to array of objects;

      collection.find().toArray((err, docs) => {
        assert.strictEqual(err, null);
        console.log("Found Documents:", docs);

        client.close();
      });
    }
  );
});

//nested callbacks, bc you're working with async operations
