const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5be61547e2601e1c0a085c5011';
//
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// find
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });

// finding one, mongoose does ID object constructor automatically
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// find by ID only
// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo By ID', todo);
// }).catch((e) => console.log(e));

var id = '5be48d1e83a88c0cb686f725';

User.findById(id).then((user) => {
  if (!user) {
    return console.log('User not found');
  }
  console.log('User By ID', user);
}).catch((e) => console.log(e));
