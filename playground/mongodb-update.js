const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId

MongoClient.connect('mongodb://localhost:27017/ToDoApp', function(err, db) {
    if(err) {
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server.');

    // db.collection('ToDos').findOneAndUpdate({
    //     _id : new ObjectId('5a5d90353c79e8b6c93419cb')
    // }, {
    //     $set : {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then(function (result) {
    //     console.log(result);
    // })

    db.collection('Users').findOneAndUpdate({
        _id : new ObjectId('5a5d96de3c79e8b6c9341bd5')
    }, {
        $set : {
            name: "George"
        },
        $inc : {
            age : 1
        }
    }, {
        returnOriginal: false
    }).then(function(result){
        console.log(result);
    });

    //  db.close();
});

