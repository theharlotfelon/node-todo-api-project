const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/ToDoApp', function(err, db) {
    if(err) {
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server.');

    // db.collection('ToDos').insertOne({
    //     text: "something to do",
    //     completed: false
    // }, function (err, res) {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(res.ops, undefined, 4));
    // });

    //insert new doc into Users collection. {name, age, location}

    // db.collection('Users').insertOne({
    //     name: "George",
    //     age: 35,
    //     location: "Austin"
    // }, function(err, res) {
    //     if(err) {
    //         return console.log('Unable to insert User', err);
    //     }
    //     console.log(JSON.stringify(res.ops, undefined, 4));
    // });
    // db.close();
});

