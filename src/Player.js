import React, {useEffect,useState} from 'react';
import api from "./api/api";
import SpotifyPlayer from 'react-spotify-web-playback';
import Store from "./alasql/Store";
//import './styles_player'


//play is a promise function which de-refs the input object and

function Main(props) {
	console.log("$player",props);
	// var token = null;
	//var token = "BQBOHZzUm9289ptWT1vq3Lz7xn5c1V2mW7jpF2XiI0ULLm1viCwnhZD5eAHX4Xr4U5Y1I4lJGXAe6eDFoep-2P63q293KXlfppL8q0QiRuqsXSp2fKTb0mVLKCjrzYneH0pmm2uhluhNQWH3MW0SqVjBxAHq0T7ut8nkJ_7BXPWI96wXpq0cCP6b1ZOvQVR-6pqAzw2-xJN7BSPdHfp9avt1rncpQdMAd0rNc1ypP62qFmvTDNCCjKHiltFZG71wygRbLxf7XjZiyCOTHcZEihebLcI"

	function callback(u){
		console.log("$update",u);
	}
	const [token, tokenSet] = useState(null);

	//at first I was like 'well should I really be fetching this every time I play?
	//but for now that's actually the best way to go until I implement a proper token refresh system

	// useEffect(() => {
	// 	api.getToken().then(token =>{
	// 		tokenSet(token)
	// 	});
	// })
	//var t = "BQCniGGJWGA3Vn8a1gMYzOs7rBZC04VpEl3SwsMOMdb72xC1cemJBPLmIBgB4TudPa2_48B-q0c8qXZZal_qPoMPz9FanOlpGZ2Mhs24kh-NlukLiyCYa6v5SPioeYohH5_Jhziet5i7oQ7vYncLFPajb5N4vF1rVY9RM1cpATRC3svxbHAslhMwB_zNrHOmzQXujpJEweecqhCvGCLXbokSvarIxI_pHp8qgc2DYWW7X3ln-gl39L35pTTBbAo0c2zNE7clMxkqnQ4iSWaZXQgLc7ewQQ"

	//'spotify:track:7xGfFoTpQ2E7fRF5lN10tr'
	//todo: doesn't seem to work
	//autoPlay={true}
	return(
		<SpotifyPlayer token={props.token} uris={['spotify:track:' + props.id]} callback={callback} play={props.play} />)




	//return(<div></div>)
}
export default Main;
// export{
// 	play,player
// }