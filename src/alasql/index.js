

import alasql from "alasql";

import api from "../api";
import {normalize} from "normalizr";
import * as apiSchemas from "../db/apiSchemas";


var tables = {};
tables["playlists"] = {};
tables["artists"] = {};
const alasqlAPI = {
	tables:tables,
	fetchPlaylists: async (user) => {
		let playlists = await api.fetchPlaylists(user).catch(e =>console.log(e));
		//var playlists = {};playlists.items = [{id: 99, text: "playlist99"},{id: 98, text: "playlist98"}]
		console.log("fetchPlaylists", playlists);

		tables["playlists"][{user}] = playlists;
		console.log('t',tables["playlists"][{user}]);
		return playlists
	},
	followedArtists: async (user) => {
		let artists = await api.getMyFollowedArtists(user).catch(e =>console.log(e));
		//var playlists = {};playlists.items = [{id: 99, text: "playlist99"},{id: 98, text: "playlist98"}]
		console.log("followedArtists", artists);

		tables["artists"][{user}] = artists;
		console.log('t',tables["artists"][{user}]);
		return artists
	}

}

export default alasqlAPI;
