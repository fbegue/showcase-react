import * as apiSchemas from "./apiSchemas";
import * as models from "./models";
import useNormalizedApi from "./useNormalizedApi";
import createDB from "../react-use-database/index.es.js";
import {GenreSchema} from "./models";

let [ DatabaseProvider, useDB ] = createDB(
  models,
  {
    storedQueryDefinitions: {
      ALL_TODOS: {
        schema: [models.TodoSchema],
        defaultValue: []
      },
      ACTIVE_TODOS: {
        schema: [models.TodoSchema],
        defaultValue: []
      },
      COMPLETED_TODOS: {
        schema: [models.TodoSchema],
        defaultValue: []
      },
      ALL: {
        schema: [models.PlaylistSchema],
        defaultValue: []
      },
      ALL_ARTISTS: {
        schema: [models.ArtistSchema],
        defaultValue: []
      },
      ALL_GENRES: {
        schema: [models.GenreSchema],
        defaultValue: []
      },
      ALL_EVENTS: {
        schema: [models.EventSchema],
        defaultValue: []
      },
    }
  }
);

export { useDB, DatabaseProvider }
