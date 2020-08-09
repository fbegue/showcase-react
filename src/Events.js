import React, {useEffect, useContext} from 'react';

// import axios from "../../api/axios";
import {Context} from './alasql/Store'

const Events = () => {
	const [state, dispatch] = useContext(Context);

	function add(){
		dispatch({type: 'ADD_POST', payload: {id:1},user:'user_f',context:'myLibArtists'});
	}

	const posts = state.posts.map(post =>
		<div>
			<div>{post.id}</div>
			{post.genres.map(g =>
				<div>{g.name} </div>
			)}
		</div>
	);

	return (
		<div>
			<button onClick={add}>Add</button>
			{posts}
		</div>
	);
	// return (
	// 	{posts}
	// );
};
export default Events;