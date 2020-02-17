import { TodoSchema,PlaylistSchema,ArtistSchema,GenreSchema,EventSchema} from "./models";

export const fetchTodosResponseSchema = [TodoSchema];
export const updateTodoResponseSchema = TodoSchema;
export const addTodoResponseSchema = TodoSchema;
export const deleteTodoResponseSchema = TodoSchema;

export const fetchPlaylistResponseSchema = [PlaylistSchema];
export const fetchArtistResponseSchema = [ArtistSchema];
export const fetchGenreResponseSchema = [GenreSchema];
export const fetchEventResponseSchema = [EventSchema];

export const updateGenreResponseSchema = GenreSchema;
export const updatePlaylistResponseSchema = PlaylistSchema;




