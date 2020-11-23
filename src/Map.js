import React from "react";
import Ohio from './data/maps/Ohio'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import {Control} from "./index";
import { withStyles } from '@material-ui/core/styles';

function Map(props) {
	let control = Control.useContainer();


	//testing: just Ohio rn
	var states = {"OH":[
			{"displayName":"Columbus", "id":9480},
			{"displayName":"Cleveland", "id":14700},
			{"displayName":"Cincinnati", "id":22040},
			// {"displayName":"Dayton", "id":3673},
			{"displayName":"Toledo", "id":5649}
		]};
	var toggleMap = {};
	states['OH'].forEach(s =>{
		toggleMap[s.id] = 'default'
	})

//{"displayName": "Salt Lake City", "id":13560}
//{"displayName":"SF Bay Area", "id":26330}


	const [color, setColor] = React.useState(toggleMap);

	const setSelect = (e,metro) => {
		console.log("setSelect",metro);
		//testing: tried all I could to use these values but react just doesn't work like that
		//g.selected = "blue"
		//g.selected = !g.selected;
		//e.target.classList = (g.selected ? "selected":"unselected");


		//note: set this up for multi-toggle, but for now clearing all values instead
		var clone = JSON.parse(JSON.stringify(color))
		Object.keys(clone).forEach(k =>{
			clone[k] = 'default'
		})
		clone[metro.id] = 'selected';
		setColor(clone);
		control.selectMetro(metro.id);
		//working multi-toggle

		// color[metro.id] === 'selected' ? setColor({...color,[metro.id]:'default'})
		// 	:setColor({...color,[metro.id]:'selected'})

	};

	//from the map
	function handleClick(id){
		console.log("handleClick",id);
		setSelect(null,{id:id})
		control.selectMetro(id);
	}

	//note: so thru some undesired learning time...
	//1) remembered that state is fucking state - can't do dynamic css in react w/out some sort of state container
	//2) tried to follow this example, but realized that I couldn't pass a full object - only a string - in the props
	//unless I turned it into a proper function first instead of just like in StyledButtonExample


	const styledBy = (property, mapping) => (props) => mapping[props[property]];
	const styles = {
		root: {
			background: styledBy('color', {
				default: 'inherit',
				selected: '#80808026',
			}),
		},
	};
	const _StyledListItem = function({classes,metro,...other}){
		return <ListItem className={classes.root} {...other}
						 button
						 key={metro.id}
						 onClick={(e) => setSelect(e,metro)}>
			{metro.displayName}
		</ListItem>
	}
	const StyledListItem = withStyles(styles)(_StyledListItem)
	// const StyledButtonExample = withStyles(styles)(({ classes, color, ...other }) => (
	// 	<button className={classes.root} {...other} />
	// ));


	return (
		<div style={{display:"flex"}}>
			<div style={{"position":"relative","left":"-10px"}}>
				<List>
					{states['OH'].map((metro, index) => (
						<StyledListItem color={color[metro.id]} metro={metro}></StyledListItem>
					))}
				</List>
			</div>
			<div style={{"position":"relative","left":"-23px"}}>
				<div >
					<Ohio height={'10em'} width={'10em'} handleClick={handleClick}></Ohio>
				</div>
			</div>
		</div>
	)}

export default Map;


