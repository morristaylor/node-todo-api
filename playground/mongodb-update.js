// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // destructuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log('Unable to connect MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

// db.collection('Todos').findOneAndUpdate({
//   _id: new ObjectID('5be140747a2157d61d17582e')
// }, {
//   $set: {
//     completed: true
//   }
// }, {
//   returnOriginal: false
// }).then((result) => {
//   console.log(result);
// })

db.collection('Users').findOneAndUpdate({
  _id: new ObjectID('5be0ad3e85f1ce08c0e23140')
}, {
  $set: {
    name: 'John'
  },
  $inc: {
    age: +1
  }
}, {
  returnOriginal: false
}).then((result) => {
  console.log(result);
})


  client.close();
});
