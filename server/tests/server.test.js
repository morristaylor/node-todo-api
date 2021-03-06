const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
    });
  });

  describe('GET /todos route', () => {
    it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
  });

  describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
      var hexID = new ObjectID().toHexString();
      request(app)
        .get(`/todos/${hexID}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
      request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
      var hexID = todos[0]._id.toHexString();

      request(app)
        .delete(`/todos/${hexID}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexID);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Todo.findById(hexID).then((todo) => {
            expect(todo).toNotExist();
            done();
          }).catch((e) => done());
        });
    });

    it('should return 404 if todo not found', (done) => {
      var hexID = new ObjectID().toHexString();
      request(app)
        .delete(`/todos/${hexID}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
      request(app)
        .delete('/todos/abc123')
        .expect(404)
        .end(done);
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) =>{
      var hexID = todos[0]._id.toHexString();
      var newText = 'This is the new tested text';

      request(app)
        .patch(`/todos/${hexID}`)
        .send({
          completed: true,
          text: newText
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.completed).toBe(true);
          expect(typeof res.body.todo.completedAt).toBe('number');
          expect(res.body.todo.text).toBe(newText);
        })
        .end(done)
     });

    it('should clear completedAt and when todo is not completed', (done) => {
      var hexID = todos[1]._id.toHexString();
      var newText = 'This is the new tested text for todo #2';
      request(app)
        .patch(`/todos/${hexID}`)
        .send({
          completed: false,
          text: newText
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toBeNull();
          expect(res.body.todo.text).toBe(newText);
        })
        .end(done)
      });
  });
