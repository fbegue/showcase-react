import React from 'react';
import _ from 'lodash';
import axios from 'axios';
import api from './api/api'
import { GLOBAL_UI_VAR } from './alasql/withApolloProvider';
//source:
//https://dev.to/myogeshchavan97/how-to-create-a-spotify-music-search-app-in-react-328m

export const getParamValues = (url) => {
	return url
		.slice(1)
		.split('&')
		.reduce((prev, curr) => {
			const [title, value] = curr.split('=');
			prev[title] = value;
			return prev;
		}, {});
};

//shouldn't need this since my server will hold onto code

// export const setAuthHeader = () => {
// 	try {
// 		const params = JSON.parse(localStorage.getItem('params'));
// 		if (params) {
// 			axios.defaults.headers.common[
// 				'Authorization'
// 				] = `Bearer ${params.access_token}`;
// 		}
// 	} catch (error) {
// 		console.log('Error setting auth', error);
// 	}
// };

export default class RedirectPage extends React.Component {
	componentDidMount() {
		const { setExpiryTime, history, location } = this.props;
		try {
			if (_.isEmpty(location.hash)) {
				return history.push('/dashboard');
			}
			const access_token = getParamValues(location.hash);
			const expiryTime = new Date().getTime() + access_token.expires_in * 1000;
			localStorage.setItem('params', JSON.stringify(access_token));
			localStorage.setItem('expiry_time', expiryTime);

			history.push('/dashboard');
			api.setAccessToken(access_token)
				.then(r =>{
					GLOBAL_UI_VAR({access_token:access_token})
				},e =>{console.error(e)})

		} catch (error) {
			history.push('/');
		}
	}
	render() {
		return null;
	}
}