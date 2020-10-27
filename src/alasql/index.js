

import alasql from "alasql";
import _ from "lodash";
import api from "../api";
import {normalize} from "normalizr";
import * as apiSchemas from "../db/apiSchemas";

import React, {useEffect, useContext} from 'react';
import {Context} from './Store'

//fix this
import tables from './tables'


const alasqlAPI = {

	fetchPlaylists: async (user) => {
		let playlists = await api.fetchPlaylists(user).catch(e =>console.log(e));
		//playlists.items = [{id: 99, text: "playlist99"},{id: 98, text: "playlist98"}]
		console.log("fetchPlaylists", playlists);
		return playlists
	},
	fetchPlaylistsResolved: async (user) => {
		let playlistObs = await api.fetchPlaylistsResolved(user).catch(e =>console.log(e));
		//testing: managing this stuff could be complicated
		//not sure exactly where artistFreq goes but it seems so small that I can just keep it as sidekick I think - right?
		//point of at least keeping artistFreq seperate is that these artists should be pulled from a local db of some kind
		//NOT passed around on the playlist object itself

		var playlists = [];
		playlistObs.forEach(ob =>{
			var p = Object.assign({},ob.playlist)
			p.artistFreq = ob.artistFreq;
			p.artists = ob.resolved;
			playlists.push(p);
		})
		console.log("fetchPlaylistsResolved", playlists);
		return playlists
	},
	followedArtists: async (user) => {

		let artists = await api.getMyFollowedArtists(user).catch(e =>console.log(e));
		//var playlists = {};playlists.items = [{id: 99, text: "playlist99"},{id: 98, text: "playlist98"}]
		console.log("followedArtists", artists);

		//NO you can't call these unless I'm in a component ;)

		// const [state, dispatch] = useContext(Context);
		// dispatch({type: 'init', payload: ids,user:user,context:'artists'});

		return artists
	},

	fetchEvents: async (user) => {
		let events = await api.fetchEvents(user).catch(e =>console.log(e));
		console.log("events", events);
		return events
	}

}

export default alasqlAPI;
