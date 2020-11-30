import React, {createContext, useReducer} from "react";
import Reducer from './Reducer'
import tables from './tables'

//so we got tables, and we got state, and we got the initial state of nodes

let initialState = {
	posts: [],
	artists:[],
	events:[],
	artistSearchSelection:[],
	node:[{id:1,name:"agg",data:[]}],
	//testing:
	dacandyman01_artists:[],
	dacandyman01_playlists:[],
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