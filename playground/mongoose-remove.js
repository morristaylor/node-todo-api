const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}) depreciated
// Todo.deleteMany({}).then((result) => {
//   console.log(result)
// });

Todo.findOneAndDelete('5beda7f51a96a2b824e323b2').then((todo) => {
  console.log(todo);
});
