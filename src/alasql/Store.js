import React, {createContext, useReducer} from "react";
import Reducer from './Reducer'


const initialState = {
	posts: [],
	artists:[],
	events:[],
	artistSearchSelection:[],
	node:[],
	//testing:
	dacandyman01_artists:[],
	error: null
};

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