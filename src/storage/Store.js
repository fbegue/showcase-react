import React, {createContext, useReducer} from "react";
import Reducer from './Reducer'
import tables from './tables'

//so we got tables, and we got state, and we got the initial state of nodes


let initialState = {
	posts: [],
	artists:[],
	events:[],
	artistSearchSelection:[],
	// node:[{id:1,name:"agg",data:[]}],
	node:[
		{
			"id": 0,
			"name": "agg",
			"label": "Aggregate",
			"data": []
		},
		{
			"id": 1,
			"name": "saved",
			"label": "Saved Artists",
			"data":[]
		},
		{
			"id": 2,
			"name": "top",
			"label": "Top Artists",
			"data": []
		},
		{
			"id": 4,
			"name": "playlists",
			"label": "Playlists",
			"data": []
		},
		{
			"id": 9999,
			"name": "recent",
			"label": "Recently Played",
			"data": []
		}
	],
	//testing:
	dacandyman01_artists:[],
	dacandyman01_playlists:[],
	dacandyman01_tracks:[],
	dacandyman01_playlists_stats:null,
	users:[],
	error: null
};

var types = ["artists","playlists"]
export function initUser(user){
	tables['users'][user.id] = {artists:[],playlists:[] };
	types.forEach(t =>{
		initialState[user.id + "_" + t] = []
	})
	//console.log("$initUser",tables['users']);
}

const Store = ({children}) => {
	const [state, dispatch] = useReducer(Reducer, initialState);
	return (
		<Context.Provider value={[state, dispatch]}>
			{children}
		</Context.Provider>
	)
};

export const Context = createContext(initialState);
export default Store;
