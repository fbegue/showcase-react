

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
		const [state, dispatch] = useContext(Context);
		let playlists = await api.fetchPlaylists(user).catch(e =>console.log(e));
		playlists.items = [{id: 99, text: "playlist99"},{id: 98, text: "playlist98"}]
		console.log("fetchPlaylists", playlists);
		dispatch({type: 'SET_CONTEXT', payload: playlists,user:user,context:'myPlaylists'});
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
