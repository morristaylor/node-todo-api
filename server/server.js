require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.sendStatus(400);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.Sendstatus(400);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.sendStatus(404);
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.sendStatus(404);
    }

    res.send({todo});
  }).catch((e) => {
    res.sendStatus(400);
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.sendStatus(404);
  }

  Todo.findOneAndDelete({_id: id}).then((todo) => {
    if (!todo) {
      return res.sendStatus(404)
    }

    res.send({todo});
  }).catch((e) => {
    res.sendStatus(400);
    });
  });

  app.patch('/todos/:id', (req, res) => {
    var id = req.params.id
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
      return res.sendStatus(404);
    }

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id}, {$set: body}, {new: true}).then((todo) => {
      if (!todo) {
        return res.sendStatus(404);
      }

      res.send({todo});
    }).catch((e) => {
      res.sendStatus(400);
    })
  });

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
