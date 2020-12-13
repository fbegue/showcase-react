

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
	fetchPlaylistsResolved: async (req) => {
		let playlistObs = await api.fetchPlaylistsResolved(req).catch(e =>console.log(e));
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
	followedArtists: async (req) => {

		let artists = await api.getMyFollowedArtists(req).catch(e =>console.log(e));
		//var playlists = {};playlists.items = [{id: 99, text: "playlist99"},{id: 98, text: "playlist98"}]
		console.log("followedArtists", artists);

		artists.forEach(a =>{

		})

		//NO you can't call these unless I'm in a component ;)

		// const [state, dispatch] = useContext(Context);
		// dispatch({type: 'init', payload: ids,user:user,context:'artists'});

		return artists
	},
	fetchEvents: async (req) => {
		let events = await api.fetchEvents(req).catch(e =>console.log(e));
		console.log("events", events);
		return events
	},
	getTopArtists: async (req) => {
		let map = await api.getTopArtists(req).catch(e =>console.log(e));
		console.log("getTopArtists termmap", map);
		return map
	},
	fetchStaticUser: async (req) => {
		let res = await api.fetchStaticUser(req).catch(e =>console.log(e));
		return res
	},
	getArtistTopTracks: async (id) => {
		let tracks = await api.getArtistTopTracks(id).catch(e =>console.log(e));
		console.log("events", tracks);
		return tracks
	}

}

export default alasqlAPI;
