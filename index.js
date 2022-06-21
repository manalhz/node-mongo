const MongoClient = require("mongodb").MongoClient;
const assert = require("assert").strict;
const dboper = require("./operations");

const url = "mongodb://localhost:27017/";
//port number at which the server is running: 27017
const dbname = "nucampsite";
//assign name of database - this name was assigned by mongo repl

//MongoClient.connect = connects to mongodb server. client object connects to nucampsite db;
MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected correctly to server");

    const db = client.db(dbname);

    //dropping a collection from a database means deleting it
    //first argument is the name of the collection, second is callback with err and result as arguments;
    db.dropCollection("campsites")
      .then((result) => {
        console.log("Dropped Collection", result);
      })
      .catch((err) => console.log("No collection to drop."));
    //insert new collection to db;
    dboper
      .insertDocument(
        db,
        { name: "Breadcrumb Trail Campground", description: "Test" },
        "campsites"
      )
      .then((result) => {
        console.log("Insert Document:", result.ops);
        //ops = operations, can contain different values; in this case, the array that's inserted.
        return dboper.findDocuments(db, "campsites");
      })
      .then((docs) => {
        console.log("Found Documents:", docs);

        return dboper.updateDocument(
          db,
          { name: "Breadcrumb Trail Campground" },
          { description: "Updated Test Description" },
          "campsites"
        );
      })
      .then((result) => {
        console.log("Updated Document Count:", result.result.nModified);

        return dboper.findDocuments(db, "campsites");
      })
      .then((docs) => {
        console.log("Found Documents:", docs);

        return dboper.removeDocument(
          db,
          { name: "Breadcrumb Trail Campground" },
          "campsites"
        );
      })
      .then((result) => {
        console.log("Deleted Document Count:", result.deletedCount);
        return client.close();
      })
      .catch((err) => {
        console.log(err);
        client.close();
      });
  })
  .catch((err) => console.log(err));
