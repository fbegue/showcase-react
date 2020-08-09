import React, {Component, useState, useEffect, useContext} from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import './EventsList.css'
import Typography from '@material-ui/core/Typography';
import Moment from 'moment';
import Chip from '@material-ui/core/Chip';
import {Context} from "./alasql/Store";

import Paper from '@material-ui/core/Paper';
import TextField from "@material-ui/core/TextField";

function ChipsArray(props) {
	//const classes = useStyles();
	//todo: implement useStyles
	//see 'chip array'
	//https://material-ui.com/components/chips/

	var classes = {root:"root",chip:"chip"}
	const [chipData, setChipData] = React.useState(props.chipData);
	console.log(typeof chipData[0].name);

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
// class EventsList extends Component {

	//todo: a) this is ugly as shit but I wonder if I really need anything more complicated?
	//b) I had to add songkick_ids to getArtistGenres, but I guess we should be expecting those
	//back anyways?

	//filter events based on selected genres
	//events have an array of performances, each performance has a single artist
	//object with an id. we need to only keep events for which at least one performance's
	//artist has a genre that is selected.

	//the db's artists have an array of genre_ids. so determine acceptable artists
	//ids by filtering them based on the selected genres. then filter events
	//based on whether they have one of those artists in a performance

	//todo:

	// if(genres.length){
	// 	//selected genres's ids
	// 	var selected = genres.filter(g =>{return g.selected});
	// 	var ids = selected.map(g => g.id);
	//
	// 	//artists who have one of the selected genres
	// 	var eartists = artists.filter(a => {
	// 		var ret = false;
	// 		for (var x = 0; x < a.genres.length; x++) {
	// 			if (ids.indexOf(a.genres[x]) !== -1) {  ret = true;break;}
	// 		}
	// 		return ret
	// 	});
	//
	// 	var eids = eartists.map(g => g.id_songkick);
	//
	// 	events = events.filter(e => {
	// 		var ret = false;
	// 		for(var x = 0; x < e.performance.length; x++){
	// 			var id = e.performance[x].artist.id;
	// 			if(eids.indexOf(id) !== -1){ret = true;break;}
	// 		}
	// 		return ret;
	// 	});
	//
	// 	console.log("updated events",events);
	// }

	// this.props.data = events;
	// console.log("events",events);
	//
	// setInterval(e =>{
	// 	var t = "events";
	// 	//testing:
	// 	var user = '123028477'
	// 	events = alasqlAPI.tables[t][{user}] ?  alasql("SELECT * from ? " + t,[alasqlAPI.tables[t][{user}]]):[];
	// 	console.log("$events",events);
	//

	//
	// 	this.forceUpdate();console.log('update',events);
	// 		 },2000);

	// function determineDepthOfObject(object) {
	// 	let depth = 0;
	// 	if (object.children) {
	// 		object.children.forEach(x => {
	// 			let temp = determineDepthOfObject(x);
	// 			if (temp > depth) {
	// 				depth = temp;
	// 			}
	// 		})
	// 	}
	// 	return depth + 1;
	// }
	// console.log("depth",determineDepthOfObject(menuItems.data[3]));


	//----------------------------------------------------
	//what the fuck


	const [localState, setState] = useState([]);
	const [state, dispatch] = useContext(Context);

	// useEffect(() => {
	// 	(async () => {
	// 		await fetchEvents();
	// 		var user = '123028477';var t = "events";
	// 		events = alasqlAPI.tables[t][{user}] ?  alasql("SELECT * from ? " + t,[alasqlAPI.tables[t][{user}]]):[];
	// 		console.log("$events",events);
	// 		setData(events);
	// 	})();
	// }, []);


// this method sets the current state of a menu item i.e whether
// it is in expanded or collapsed or a collapsed state

	function handleClick(id) {
		console.log("click");
		// localState[id] = !localState[id]
		setState(prevState => ({ [id]: !prevState[id] }));
	}




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

		// var renderLevel = function(op){
		// 	console.log("$",op);
		// 	if(op.venue){return op.venue.displayName}
		// 	if(op.artist){return op.artist.displayName}
		// }

		//was trying a depth-based style here.
		// function getDepth(d){
		// 	return {marginLeft: d + 'em',color: 'blue'}
		// }
		// style={getDepth(subOption.depth)}

		// const { classes } = this.props;
		//todo:
		// const { state } = this;
		//var state = {};

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
										{/*<div onClick={e=>{console.log(subOption)}}>{subOption.displayName}</div>*/}
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
						{localState[subOption.id]}
						{localState[subOption.id] ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={localState[subOption.name]} timeout="auto" unmountOnExit>
						{handler( subOption[subOption.childrenKey],subOption.childrenKey, ) }
					</Collapse>
				</div>
			);
		});
	}

	//const { classes, drawerOpen, menuOptions } = this.props;
	//todo:
	var classes = {menuHeader:"menuHeader",list:"list"};
	return (
		<div className={classes.list}>
			<List>
				<ListItem  key="menuHeading" divider disableGutters>
					<ListItemText
						//className={classes.menuHeader}
						// style={getStyle()}
						inset
						primary="Events"
					/>
				</ListItem>
				{handler(state.events)}
			</List>
		</div>
	);
}
// export default withStyles(styles)(MenuBar_class)
export default EventsList