import { schema } from "normalizr";

export const TodoSchema = new schema.Entity("Todo");
export const PlaylistSchema = new schema.Entity("Playlist");
export const ArtistSchema = new schema.Entity("Artist");
export const GenreSchema = new schema.Entity("Genre");