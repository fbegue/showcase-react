// const uuidv4 = require('uuid/v4');
// This is a fake in-memory implementation of something
// that would be implemented by calling a REST server.
import {getUserPlaylists} from "../testdata/getUserPlaylists";
import {getArtistGenres} from "../testdata/getArtistGenres";
import {getMetroEvents} from "../testdata/getMetroEvents";
import $ from 'jquery';

const host = "http://localhost:8888";

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
        //fetch(host + '/getUserPlaylists', {method: "POST", mode: "no-cors"})


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

//user methods

var fetchPlaylists =  function(){
    return new Promise(function(done, fail) {
        //testing: must turn cors off in browser

        $.ajax({
            url: 'http://localhost:8888/getUserPlaylists',
            type:"POST"
        }).done(function(payload){
                console.log("$retrieved: ",payload);
                done(payload.items)
            })
        // fakeFetch2()
    })
};

var fetchPlaylistsResolved =  function(){
    return new Promise(function(done, fail) {
        //testing: must turn cors off in browser
        $.ajax({
            url: 'http://localhost:8888/resolvePlaylists',
            type:"POST"
        }).done(function(payload){
            console.log("$retrieved",payload);
            done(payload)
        })
        // fakeFetch2()
    })
};

var getMyFollowedArtists =  function(){
    return new Promise(function(done, fail) {
        //testing: must turn cors off in browser
        $.ajax({
            url: 'http://localhost:8888/getFollowedArtists',
            type:"POST",
            data: {}
        }).done(function(payload){
            console.log("retrieved: ",payload);
            done(payload)
        })
    })
}

//event methods

var fetchEvents =  function(req){
    return new Promise(function(done, fail) {

        //testing: dateFilter
        var t = {start:"2020-03-11T16:36:07.100Z",end:"2020-03-16T16:36:07.100Z"};
        req.dateFilter = t;

        //example req
        // req = {
        //     metro:{displayName:"Columbus", id:9480},
        //     dateFilter:t};

        //note: cors bullshit
        //ended up going back to using the extension to allow requests to be made w/out cors
        //b/c if you change the mode here, you can't send fucking json? ffs
        //https://stackoverflow.com/questions/54016068/empty-body-in-fetch-post-request

        fetch('http://localhost:8888/resolveEvents', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
             mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
             body: JSON.stringify(req)
        }).then(res => res.json())
            .then(function(res){
            console.log("retrieved: ",res);
            done(res)
        })

        // $.ajax({
        //     url: 'http://localhost:8888/resolveEvents',
        //     type:"POST",
        //     data: {data:JSON.stringify(param)}
        //     //todo:[Object: null prototype] when trying to read
        //     //data: JSON.stringify(param)
        //     //data: param
        // }).then(function(payload){
        //     console.log("retrieved: ",payload);
        //     done(payload)
        // })

        //testing:
        // fakeFetch3().then(r =>{done(r)})
    })
}

//methods

var completeArtist =  function(param){
    return new Promise(function(done, fail) {
        $.ajax({
            url: 'http://localhost:8888/completeArtist',
            type:"POST",
            data: {artistQuery:param}
        }).done(function(payload){
            console.log("retrieved: ",payload);
            done(payload.result.body.artists.items)
        })

        //testing:
        // fakeFetch3().then(r =>{done(r)})
    })
}

var getArtistTopTracks  =  function(id){
    return new Promise(function(done, fail) {
        $.ajax({
            url: 'http://localhost:8888/getArtistTopTracks',
            type:"POST",
            data: {id:id}
        }).done(function(payload){
            //console.log("retrieved: ",payload);
            done(payload)
        })
    })
}

//-----------------------------------------------
//deprecated vvv

var getMySavedTracks =  function(){
    return new Promise(function(done, fail) {
        //testing: must turn cors off in browser
        $.ajax({
            url: 'http://localhost:8888/getMySavedTracks',
            type:"POST",
            data: {}
        }).done(function(payload){
            //console.log("retrieved: ",payload);
            done(payload.items)
        })
    })
}

var fetchArtistGenres =  function(playlists){
    return new Promise(function(done, fail) {

        //testing: must turn cors off in browser

        $.ajax({
            url: 'http://localhost:8888/resolvePlaylists',
            type:"POST",
            data: {playlists:JSON.stringify(playlists)}
        }).done(function(payload){
            //console.log("retrieved: ",payload);
            done(payload)
        })
    })
}


var getToken =  function(playlists){
    return new Promise(function(done, fail) {

        //testing: must turn cors off in browser

        $.ajax({
            url: 'http://localhost:8888/getToken',
            type:"POST",
            // data: {playlists:JSON.stringify(playlists)}
        }).done(function(payload){
            console.log("retrieved token: ",payload);
            done(payload)
        })
    })
}

//-----------------------------------------------
//todos test stuff

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
    fetchPlaylistsResolved,
    fetchEvents,
    getMySavedTracks,
    getMyFollowedArtists,
    completeArtist,
    getArtistTopTracks,
    getToken

}
