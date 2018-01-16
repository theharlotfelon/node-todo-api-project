const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId

MongoClient.connect('mongodb://localhost:27017/ToDoApp', function(err, db) {
    if(err) {
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server.');

    // db.collection('ToDos').find({
    //     _id: new ObjectId('5a5d7d19b7aa8a1303b2b284')
    // }).toArray().then(function(docs) {
    //     console.log('ToDos');
    //     console.log(JSON.stringify(docs, undefined, 4));
    // }, function (err) {
    //     console.log('Unable to fetch todos', err);
    // });

    // db.collection('ToDos').find().count().then(function(count) {
    //     console.log('ToDos');
    //     console.log(`ToDos: ${count}`);
    // }, function (err) {
    //     console.log('Unable to fetch todos', err);
    // });

    db.collection('Users').find({name: "George"}).toArray().then(function(res) {
        console.log(JSON.stringify(res, undefined, 4));
    }, function(err) {
        console.log('Unable to fetch Users', err);
    });

  //  db.close();
});

