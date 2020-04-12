import { normalize } from "normalizr";
import { useDB } from "./db";
import * as apiSchemas from "./apiSchemas";
import api from "../api";
import {queries} from "./index";

import {PlaylistSchema} from "./models";

var jstr = function(ob){return JSON.stringify(ob,null,4)}

const filterQueries = {
  'active': 'ACTIVE_TODOS',
  'all': 'ALL_TODOS',
  'completed': 'COMPLETED_TODOS'
}

//todo: not sure why he sets this up like this
const playlistFilterQueries = {
  'all': 'ALL_PLAYLISTS',
};


var testFlag = false;

const immutableOps = {
  addId: (array, id) => {
    if (!array.includes(id)) {
      return [...array, id]
    }
    return array
  },
  removeId: (array, id) => {
    return array.filter(itemId => itemId !== id)
  }
}

const useNormalizedApi = () => {
  let db = useDB();

  return {
    showStore: async (filter) => {

      let allTodosQuery = db.getStoredQuery('ALL_TODOS');
      console.log(allTodosQuery);
      let allTodos = db.executeQuery(allTodosQuery);
      console.log(allTodos);

      //todo: returns the id instead of the object?

      let pqry = db.getStoredQuery('ALL');
      console.log(pqry);
      let allPlaylists = db.executeQuery(pqry);
      console.log(allPlaylists);

      let pqry2 = db.getStoredQuery('ALL_ARTISTS');
      console.log(pqry);
      let ALL_ARTISTS = db.executeQuery(pqry2);
      console.log(ALL_ARTISTS);

      // let pqry3 = db.getStoredQuery('SELECTED_GENRES');
      // console.log(pqry);
      // let SELECTED_GENRES = db.executeQuery(pqry3);
      // console.log(SELECTED_GENRES);


      // const queries = {
      //   getTodoById: id => {
      //     return {
      //       schema: PlaylistSchema,
      //       value: id
      //     };
      //   }
      // };

      // let queryToGetTodoWithIdOne = queries.getTodoById("7tSKoibeWp1Eh5TitvbjKo");
      // let todo = db.executeQuery(queryToGetTodoWithIdOne);
      // console.log(todo);

      //todo: not returning then'able result means can't call props.onCancel/Success
      return {
        value: {},
        schema: apiSchemas.fetchTodosResponseSchema
      };
    },
    testTodo: async (filter) => {

      // var payload =
      //     {id: 99,
      //       text: "playlist99",
      //       completed: false,
      //       testField:true};
      //
      // let todo = await api.updateTodo(99, payload);
      // let { result, entities } = normalize(
      //     todo,
      //     apiSchemas.updateTodoResponseSchema
      // );
      // db.mergeEntities(entities);
      //
      // return {
      //   value: result,
      //   schema: apiSchemas.fetchTodosResponseSchema
      // };
    },
    fetchTodos: async (filter) => {
      //filter = active
      let todos = await api.fetchTodos(filter);
      let { result, entities } = normalize(
          todos,
          apiSchemas.fetchTodosResponseSchema
      );
      console.log("todos",todos);
      console.log("result",result);
      db.mergeEntities(entities);
      db.updateStoredQuery(filterQueries[filter], result);

      //seemed odd that we we're updating all here on initialization?
      db.updateStoredQuery(filterQueries['all'], result);

      return {
        value: result,
        schema: apiSchemas.fetchTodosResponseSchema
      };
    },
    fetchPlaylists: async (filter) => {

      let playlists = await api.fetchPlaylists(filter);

      //var playlists = {};playlists.items = [{id: 99, text: "playlist99"},{id: 98, text: "playlist98"}]

      console.log("fetchPlaylists",playlists);


      let { result, entities } = normalize(
          playlists,
          apiSchemas.fetchPlaylistResponseSchema
      );
     // console.log("playlist",playlists);
      console.log("result",result);
      db.mergeEntities(entities);
      db.updateStoredQuery(playlistFilterQueries['all'], result);

      //no

      // var rlts = [];
      // var result2 = {};
      // playlists.forEach(function(p){
      //   let { result, entities } = normalize(
      //       p,
      //       apiSchemas.fetchPlaylistResponseSchema
      //   );
      //   rlts.push(result);
      //   result2 = result;
      //   // console.log("playlist",playlist);
      //   // console.log("result",result);
      //   db.mergeEntities(entities);
      //   db.updateStoredQuery(playlistFilterQueries['all'], result);
      // });

      return {
        value: result,
        schema: apiSchemas.fetchPlaylistResponseSchema
      };
    },
    fetchArtistGenres: async (playlists) => {

      let playObs = await api.fetchArtistGenres(playlists);
     console.log("fetchArtistGenres playObs",playObs);
      //looks like: {playlist:{},tracks:[],artists:[],payload:[],db:[],lastLook:[]}

      var genres = [];
      var artists = [];

      //todo: somehow one of these is not a string
      //needs to be fixed upstream

      var inG = function(gin){
        genres.forEach(g =>{
          if(g.id == gin.id){return true}return false;
        })
      }
      playObs.forEach(p =>{
        p.artists.forEach(a => {
          a.genres.forEach(g => {
           // genres.indexOf(g) === -1 ? genres.push(g):{};

            !(inG(g))?genres.push(g):{};
          });
          artists.push(a);
        })
      });

      //for some reason these can't happen one after another
      var a =  function(){
        return new Promise(function(done, fail) {
          let { result, entities } = normalize(
              artists,
              apiSchemas.fetchArtistResponseSchema
          );
          db.mergeEntities(entities);
          db.updateStoredQuery("ALL_ARTISTS", result);
          console.log(entities);
          console.log(result);
          done()
        })
      }

      var g =  function(){
        return new Promise(function(done, fail) {
          let { result, entities } = normalize(
              genres,
              apiSchemas.fetchGenreResponseSchema
          );
          db.mergeEntities(entities);
          db.updateStoredQuery("ALL_GENRES", result);
          console.log(entities);
          console.log(result);
          done()
        })
      };

      a().then(g());

      //var playlist = playlists.items[0];
      // var playlist = playlists.items;
      // let { result, entities } = normalize(
      //     playlist,
      //     apiSchemas.fetchPlaylistResponseSchema
      // );
      // console.log("playlist",playlist);
      // console.log("result",result);
      // db.mergeEntities(entities);
      // db.updateStoredQuery(playlistFilterQueries['all'], result);

      //todo: not sure how result works outside of callback functions (which are disabled right now)
      var result = {};
      return {
        value: result,
        //todo:
        schema: apiSchemas.fetchPlaylistResponseSchema
      };
    },
    fetchEvents: async (filter) => {

      let events = await api.fetchEvents(filter);
      console.log("fetchEvents",events);

      let { result, entities } = normalize(
          events,
          apiSchemas.fetchEventResponseSchema
      );
      db.mergeEntities(entities);
      db.updateStoredQuery("ALL_EVENTS", result);
      // console.log(entities);
      // console.log(result);
      return {
        value: result,
        schema: apiSchemas.fetchEventResponseSchema
      };
    },
    //interesting b/c this is my first one that is being used solely to update the
    //db's local storage. notice I just needed to merge the entities - I wasn't
    //required to update the "ALL_GENRES" query b/c mergeEntity updated a member
    //of that query, triggering an update cycle

    updateGenre: async (payload) => {
      let { result, entities } = normalize(
          payload,
          apiSchemas.updateGenreResponseSchema
      );

      db.mergeEntities(entities);

      //could be useful later
      // db.updateStoredQuery('SELECTED_GENRES', (prev) => immutableOps.addId(prev, payload.id));
      return {
        value: result,
        schema: apiSchemas.updateGenreResponseSchema
      };
    },

    updatePlaylist: async (payload) => {
    let { result, entities } = normalize(
        payload,
        apiSchemas.updatePlaylistResponseSchema
    );

    db.mergeEntities(entities);

    //could be useful later
    // db.updateStoredQuery('SELECTED_GENRES', (prev) => immutableOps.addId(prev, payload.id));
    return {
      value: result,
      schema: apiSchemas.updatePlaylistResponseSchema
    };
  },
    updateTodo: async (id, payload) => {
      let todo = await api.updateTodo(id, payload);
      let { result, entities } = normalize(
          todo,
          apiSchemas.updateTodoResponseSchema
      );
      db.mergeEntities(entities);
      if (todo.completed) {
        db.updateStoredQuery('ACTIVE_TODOS', (prev) => immutableOps.removeId(prev, id));
        db.updateStoredQuery('COMPLETED_TODOS', (prev) => immutableOps.addId(prev, id));
      }
      else {
        db.updateStoredQuery('ACTIVE_TODOS', (prev) => immutableOps.addId(prev, id));
        db.updateStoredQuery('COMPLETED_TODOS', (prev) => immutableOps.removeId(prev, id));
      }

      return {
        value: result,
        schema: apiSchemas.updateTodoResponseSchema
      };
    },
    addTodo: async (text) => {

      //this goes and hits a fake api service and fake local db

      let todo = await api.addTodo(text);
      console.log(jstr(todo));

      var play = {
        id: 99,
        text: "playlist99",
        completed: false,
        testField: true
      };

      todo = play;

      let { result, entities } = normalize(
          todo,
          apiSchemas.addTodoResponseSchema
      );
      console.log("result",result);
      db.mergeEntities(entities);
      db.updateStoredQuery('ALL_TODOS', (prev) => immutableOps.addId(prev, todo.id));
      db.updateStoredQuery('ACTIVE_TODOS', (prev) => immutableOps.addId(prev, todo.id));

      //we're not using this return value but it could be useful
      return {
        value: result,
        schema: apiSchemas.addTodoResponseSchema
      };
    },
    deleteTodo: async (id) => {
      let todo = await api.deleteTodo(id);
      let { result, entities } = normalize(
          todo,
          apiSchemas.deleteTodoResponseSchema
      );
      db.mergeEntities({
        Todo: {
          [id]: {
            isDeleted: true
          }
        }
      });
      db.updateStoredQuery('ALL_TODOS', (prev) => immutableOps.removeId(prev, id));
      db.updateStoredQuery('ACTIVE_TODOS', (prev) => immutableOps.removeId(prev, id));
      db.updateStoredQuery('COMPLETED_TODOS', (prev) => immutableOps.removeId(prev, id));
      return {
        value: result,
        schema: apiSchemas.deleteTodoResponseSchema
      };
    },

  };
};

//var parseShittyTestData = function(){
//test data isn't really like what we were expecting later
//so it required some parsing
// var genres = [];
// var artists = [];
//
// artistGenres.forEach(function(ga){
//   var gname = (' ' + ga.genre).slice(1);
//   var g = {name:gname,id:ga.id_genre}
//
//   //quick uniqueness filter
//   var flag = true;
//   genres.forEach(function(ge){
//     if(ge.id === g.id){flag = false }
//   });
//   flag ? genres.push(g):{};
//
// });
//
// var artist_genre_map = {};
//
// artistGenres.forEach(function(ga){
//   !artist_genre_map[ga.id] ? artist_genre_map[ga.id] = []:{}
//   artist_genre_map[ga.id].indexOf(ga.id_genre) === -1 ? artist_genre_map[ga.id].push(ga.id_genre):{};
// });
//
// console.log("artist_genre_map",artist_genre_map);
// artistGenres.forEach(function(ga){
//
//   if(!(artists.filter(a => a.name === ga.name).length)){
//     delete ga.id_genre;
//     delete ga.genre
//     ga.genres = artist_genre_map[ga.id];
//     artists.push(ga)
//   }
// });
//
// console.log("genres",genres);
// console.log("artists",artists);
//}

export default useNormalizedApi;
