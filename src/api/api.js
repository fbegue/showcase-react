// const uuidv4 = require('uuid/v4');
// This is a fake in-memory implementation of something
// that would be implemented by calling a REST server.
import {getUserPlaylists} from "../testdata/getUserPlaylists";
import {getArtistGenres} from "../testdata/getArtistGenres";
import {getMetroEvents} from "../testdata/getMetroEvents";
let counter = 0

const fakeDatabase = {
  todos: [
    {
      id: counter++,
      text: 'Buy milk',
      completed: true
    },
    {
      id: counter++,
      text: 'Do laundry',
      completed: false
    },
    {
      id: counter++,
      text: 'Clean bathroom',
      completed: false
    },
  ]
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchTodos = filter =>
  delay(1000).then(() => {
    switch (filter) {
      case 'all':
        return fakeDatabase.todos;
      case 'active':
        return fakeDatabase.todos.filter(t => !t.completed);
      case 'completed':
        return fakeDatabase.todos.filter(t => t.completed);
      default:
        throw new Error(`Unknown filter: ${filter}`);
    }
  });

const fetchTodo = id =>
  delay(500).then(() => {
    return fakeDatabase.todos.find(t => t.id === id);
  });


var fakeFetch1 = function(){
    return new Promise(function(done, fail) {
        done(getUserPlaylists)
    })
};
var fakeFetch2 = function(){
    return new Promise(function(done, fail) {
        done(getArtistGenres)
    })
};

var fakeFetch3 = function(){
    return new Promise(function(done, fail) {
        done(getMetroEvents)
    })
};

const fetchPlaylists = id =>
    delay(500).then(() => {
        return fakeFetch1()
    });

const fetchArtistGenres = id =>
    delay(500).then(() => {
        return fakeFetch2()
    });

const fetchEvents = id =>
    delay(500).then(() => {
        return fakeFetch3()
    });




const addTodo = text =>
  delay(200).then(() => {
    const todo = {
      id: counter++,
      text,
      completed: false
    };
    fakeDatabase.todos.push(todo);
    return todo;
  });

const updateTodo = (id, {text, completed}) =>
  delay(200).then(() => {
    const todo = fakeDatabase.todos.find(t => t.id === id);
    todo.text = text === undefined ? todo.text : text;
    todo.completed = completed === undefined ? todo.completed : completed;
    return todo;
  });

const deleteTodo = (id) =>
  delay(200).then(() => {
    let deletedTodo = fakeDatabase.todos.find(t => t.id === id);
    fakeDatabase.todos = fakeDatabase.todos.filter(t => t.id !== id);
    return deletedTodo;
  });

export default {
  fetchTodos,
  fetchTodo,
  addTodo,
  updateTodo,
  deleteTodo,
    fetchPlaylists,
    fetchArtistGenres,
    fetchEvents
}
