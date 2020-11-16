import React, {Component, useContext, useEffect, useState} from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import './EventsList.css'
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import Moment from 'moment';

import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import {Context} from "./alasql/Store";
import ChipsArray from "./ChipsArray";


import Player, {play,player} from './Player'
import {Control} from "./index";
import MusicNoteIcon from '@material-ui/icons/MusicNote';


function ChipsArray_dep(props) {
	//const classes = useStyles();
	//todo: implement useStyles
	//see 'chip array'
	//https://material-ui.com/components/chips/

	var classes = {root:"root",chip:"chip"}
	const [chipData, setChipData] = React.useState(props.chipData);
	if(chipData.length > 0){
		console.log("$chipData",chipData);
	}

	//console.log(typeof chipData[0].name);

	//leaving as example on how to interact with later
	const handleDelete = chipToDelete => () => {
		setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
	};

	return (

		<div style={{maxWidth:"40em"}} className={classes.root}>
			{chipData.map(data => {
				//let icon = <TagFacesIcon />;
				return (
					<Chip
						key={data.id}
						// icon={icon}
						label={data.name}
						className={classes.chip}
					/>
				);
			})}
		</div>
	);
}

function EventsList(){

	//testing: probably shouldn't put this HERE exactly...



	// this method sets the current state of a menu item i.e whether
	// it is in expanded or collapsed or a collapsed state

	const [state, setState] = useState({});
	const [globalState, dispatch] = useContext(Context);
	let control = Control.useContainer()

	function handlePlay(item) {
		console.log("$handlePlay",item);
		control.setId(item.spotifyTopFive[0])
		control.setId(item.spotifyTopFive[0])
		control.togglePlay(!control.play)
	}


	function handleClick(item) {
		setState(prevState => ({ [item]: !prevState[item] }));
	}


	function unHolyDrill(item){
		//console.log("$unHolyDrill",item);
		// var ret = false;
		// item.performance.forEach()
		for(var x = 0; x < item.performance.length;x++){
			var ip = item.performance[x];
			if(ip.artist.spotifyTopFive){
				return true
			}
		}
		return false;
	};

	// if the menu item doesn't have any child, this method simply returns a clickable menu
	// item that redirects to any location and if there is no child this method uses recursion to go until
	// the last level of children and then returns the item by the first condition.
	function handler(children,key) {

		var moment = function(dt,format){
			//console.log("$m",Moment(dt).format(format));
			if(dt.length){
				dt[0] ? dt = dt[0]:dt = dt[1]
			}
			if(Moment(dt).format(format) !== 'Invalid date'){
				return(<React.Fragment> {Moment(dt).format(format)} </React.Fragment>) //basically you can do all sorts of the formatting and others
			}else{return ""}
		};

		//todo:
		//const { classes } = props;
		// const { state } = this;

		return children.map(subOption => {
			if (!subOption.childrenKey) {
				return (
					<div key={subOption.id}>
						<ListItemText
							style={{marginLeft:"2em"}}
							inset
							primary={ subOption.displayName}
							secondary={
								<React.Fragment>
									<Typography
										component="span"
										variant="body2"
										// className={classes.inline}
										color="textPrimary"
									>
										{subOption.artist.spotifyTopFive && <button onClick={() => handlePlay(subOption.artist)} >play</button>}
										<ChipsArray chipData={subOption.artist.genres}>
										</ChipsArray>
									</Typography>
									{/*{subOption.venue.displayName} -*/}
									{/*{subOption.location.city.toString().replace(", US","")}*/}
								</React.Fragment>
							}
						/>
					</div>
				);
			}
			return (
				<div key={subOption.name}>
					<ListItem  button onClick={() => handleClick(subOption.id)}>
						{unHolyDrill(subOption) && <MusicNoteIcon style={{"position":"absolute","left":"49px","top":"10px"}} fontSize={'small'}/>}
						<ListItemText
							inset
							primary={ subOption.displayName.toString().replace(/at.*/,"")}
							secondary={
								<React.Fragment>
									<Typography
										component="span"
										variant="body2"
										// className={classes.inline}
										color="textPrimary"
									>
										{moment(subOption.start.date,'MMM do')}
										{moment([subOption.start.datetime,subOption.start.time],'LT')}
									</Typography>
									{subOption.venue.displayName} -
									{subOption.location.city.toString().replace(", US","")}
								</React.Fragment>
							}
						/>
						{state[subOption.name] ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={state[subOption.id]} timeout="auto" unmountOnExit>
						{handler( subOption[subOption.childrenKey],subOption.childrenKey, ) }
					</Collapse>
				</div>
			);
		});
	}

	var classes = {menuHeader:"menuHeader",list:"list"};
	return (
		<div className={classes.list}>
<div>metro {control.metro}</div>
			<List>
				<ListItem  key="menuHeading" divider disableGutters>
					<ListItemText
						//className={classes.menuHeader}
						// style={getStyle()}
						inset
						primary="Events"
					/>
				</ListItem>
				{handler(globalState.events)}
			</List>
		</div>
	);
}
// export default withStyles(styles)(MenuBar_class)
export default EventsList