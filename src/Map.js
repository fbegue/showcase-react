import React from "react";
import Ohio from './data/maps/Ohio'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import {Control} from "./index";

function Map(props) {
	let control = Control.useContainer();


	var states = {"OH":[
			{"displayName":"Columbus", "id":9480},
			{"displayName":"Cleveland", "id":14700},
			{"displayName":"Cincinnati", "id":22040},
			// {"displayName":"Dayton", "id":3673},
			{"displayName":"Toledo", "id":5649}
			]}

//{"displayName": "Salt Lake City", "id":13560}
//{"displayName":"SF Bay Area", "id":26330}

	const setSelect = (g) => {
		console.log("setSelect",g);
		g.selected = !g.selected;

		//todo: action on select

	};
	function handleClick(id){
		console.log("handleClick",id);
		control.selectMetro(id);
	}
	return (
		<div style={{display:"flex"}}>
			<div>
				<List>
					{states['OH'].map((play, index) => (
						<ListItem
							button
							key={play.id}
							onClick={() => setSelect(play)}
						>
							<Typography
								variant="subtitle1"
								color={play.selected ? 'secondary' : 'textPrimary'}
							>
								{play.displayName}
								{/*- <span style={{fontSize:"10px"}}>{play.owner.display_name}</span>*/}
							</Typography>
						</ListItem>
					))}
				</List>
			</div>
			<div>
				<div >
					<Ohio height={'10em'} width={'10em'} handleClick={handleClick}></Ohio>
				</div>
			</div>
		</div>
	)}

export default Map;


