const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId

MongoClient.connect('mongodb://localhost:27017/ToDoApp', function(err, db) {
    if(err) {
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server.');

    //deleteMany
    // db.collection('ToDos').deleteMany({text: "eat lunch"}).then(function (result) {
    //     console.log(result);
    // });
    //deleteOne
    // db.collection("ToDos").deleteOne({text: "eat lunch"}).then(function(result) {
    //     console.log(result);
    // });
    //findOneAndDelete
    // db.collection('ToDos').findOneAndDelete({completed: false}).then(function(result) {
    //     console.log(result);
    // });

    // db.collection('Users').deleteMany({name: "George"}).then(function (result) {
    //     console.log(result);
    // });

    // db.collection('Users').findOneAndDelete({_id: ObjectId('5a5d96cc3c79e8b6c9341bce')}).then(function(result) {
    //     console.log(result);
    // });



    //  db.close();
});

