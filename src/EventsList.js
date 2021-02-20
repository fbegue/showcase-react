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
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { DateTime } from "luxon";
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import {Context} from "./alasql/Store";
import ChipsArray from "./ChipsArray";
import { makeStyles } from '@material-ui/core/styles';
import {familyStyles } from './families';
import spotifyLogo from './assets/spotify_logo_large.png'


import Player, {play,player} from './Player'
import {Control} from "./index";
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Map from './Map';
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import Button from '@material-ui/core/Button';
import api from "./api/api";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR} from "./alasql/withApolloProvider";
import { useTransition, animated, config } from 'react-spring'
import Stats from './components/Stats'

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

const useStyles = makeStyles({
	root: {

	},
});

const useStylesFamilies = makeStyles(familyStyles);

function EventsList() {
	const classesPlay = useStyles();

	// this method sets the current state of a menu item i.e whether
	// it is in expanded or collapsed or a collapsed state

	const [state, setState] = useState({});
	const [globalState, dispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
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

	function ArtistImageFader(props){

		// var urls =  [
		// 	"http://images.sk-static.com/images/media/profile_images/artists/2406548/huge_avatar",
		// 	"http://images.sk-static.com/images/media/profile_images/artists/85293/huge_avatar",
		// 	"http://images.sk-static.com/images/media/profile_images/artists/177426/huge_avatar"
		// ]
		var urls = [];
		for(var x = 0; x < props.item.performance.length;x++){
        var id = props.item.performance[x].artist.artistSongkick_id || props.item.performance[x].artist.id
			if(id){urls.push("http://images.sk-static.com/images/media/profile_images/artists/" + id  + "/huge_avatar")}
		}

		//todo: prevent white-only default images from returning
		//basically need to check if the img returned is all white by inspecting pixel colors :(
		//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
		//issue now is CORS - could maybe get around this somehow but seems like the source server needs
		//to allow this, not just me setting headers
		//https://stackoverflow.com/questions/22097747/how-to-fix-getimagedata-error-the-canvas-has-been-tainted-by-cross-origin-data

		//example white image / valid image
		//http://images.sk-static.com/images/media/profile_images/artists/9392084/huge_avatar
		//http://images.sk-static.com/images/media/profile_images/artists/93920/huge_avatar

		//currently this is returning all 0s which I assume is just b/c it couldn't access anything

		// if(props.item.id ===39600437){
		// 	//console.log("urls",urls);
		// 	var img = document.createElement('img');img.src = urls[1] + '?' + new Date().getTime();img.id ='9999';
		// 	//img.setAttribute('crossOrigin', '');
		// 	img.crossOrigin = "Anonymous";
		// 	//var img = document.getElementById('9999');
		// 	var canvas = document.createElement('canvas');
		// 	canvas.width = img.width;
		// 	canvas.height = img.height;
		// 	canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
		// 	var pixelData = canvas.getContext('2d').getImageData(1, 1, 1, 1).data;
		// 	console.log("pixelData",pixelData);
		// }


		// canvas.width = img.width;
		// canvas.height = img.height;
		// canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

		if(urls.length > 1){
		const [index, set] = useState(0)
		const transitions = useTransition(urls[index], item => item, {
			from: { opacity: 0 },
			enter: { opacity: 1 },
			leave: { opacity: 0 },
			config: config.molasses,
		})
		useEffect(() => void setInterval(() => set(state => (state + 1) % urls.length), Math.floor(Math.random() * (5000 -  + 1) + 2000)), [])
		 // if(props.item.id === 39280906){
			//console.log("$urls",urls);

			return transitions.map(({ item, props, key }) => (
				<animated.div
					key={key}
					class="bg"
					style={{ ...props, backgroundImage: `url(${item})`,height:"5em",width:"5em" }}
				/>

			))
		}
		// }
		 return <div class="bg" style={{ ...props, backgroundImage: `url(${urls[0]})`,height:"5em",width:"5em" }}/>


	};

	function showPlay(sub){

		//console.log("$showPlay",sub);
		return <div>
			<span className={'play-events'}> {(sub.artist.spotifyTopFive ? <PlayCircleOutlineIcon fontSize={'small'} onClick={() => handlePlay(sub.artist)}> </PlayCircleOutlineIcon>:<div></div>)}</span>
			<span>{sub.displayName}</span>
		</div>
		// return <span>{sub.displayName}</span>
		// return (sub.artist.spotifyTopFive ? <PlayCircleOutlineIcon onClick={() => handlePlay(sub.artist)}> </PlayCircleOutlineIcon>:{})
	};



	const [openSnack, setOpenSnack] = React.useState(false);

	function makeName(){
		//console.log("makeName");
		//https://flaviocopes.com/javascript-dates/
		var m = control.startDate.getMonth() + 1
		var d = control.startDate.getDate()
		//todo: convert to name of metro
		return getTitle() + "-" + m + "-" + d
	}

	const [name, setName] = useState(makeName());

	useEffect(() => {
		setName(makeName())
	}, [control.metro,control.startDate,control.endDate]);


	function playlistFromEvents(){
		var songs = [];
		//console.log(name);
		//todo: push more songs w/ a smaller event set?
		globalState.events.forEach(e =>{
			e.performance.forEach(p =>{
				if(p.artist.spotifyTopFive){
					songs.push(p.artist.spotifyTopFive[0])
				}
			})
		})
		console.log("playlistFromEvents",songs);
		api.createPlaylist({auth:globalUI,songs:songs,playlist:{name:name}})
			.then(r =>{
				console.log("createPlaylist success");
				setOpenSnack(true);
			})
	}

	//todo: maybe make this like a row of buttons? idk
	function CreatePlay(){

		function handleSetName(e){
			console.log(e.target.value);
			setName(e.target.value)
		}

		const handleCloseSnack = (event, reason) => {
			if (reason === 'clickaway') {return;}
			setOpenSnack(false);
		};

		return (
			<div style={{display:"flex"}} >
				<div style={{marginRight:"1em"}}>
					<Snackbar
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						open={openSnack}
						autoHideDuration={4000}
						message={"Created Playlist '" + name + "'!"}
						onClose={handleCloseSnack}
						action={
							<React.Fragment>
								<IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnack}>
									<CloseIcon fontSize="small" />
								</IconButton>
							</React.Fragment>
						}
					/>
					<Button size="small" onClick={playlistFromEvents} variant="contained">
						<div style={{display:"flex"}}>
							<div ><PlaylistAddIcon fontSize={'small'}/> </div>
							<div>Save Playlist</div>
						</div>
					</Button>
				</div>
				<div>
					<form className={classes.root} noValidate autoComplete="off">
						{/*<TextField value={name} onChange={(e) =>{setName(e.target.value)}} id="standard-basic" label="" />*/}
						<TextField value={name} onChange={handleSetName} id="standard-basic" label="" />
					</form>
				</div>
			</div>
		)
	}


	const [open, setOpen] = React.useState(false);
	const [open2, setOpen2] = React.useState(true);
	const [open3, setOpen3] = React.useState(true);
	const handleClickConfig = () => {
		setOpen(!open);
	};
	const handleClickConfig2 = () => {
		setOpen2(!open2);
	};
	const handleClickConfig3 = () => {
		setOpen3(!open3);
	};
	//-----------------------------------------------------------
	//events list utilities

	function getTitle(){

		//console.log("getTitle",control.metro);
		var t = "";
		control.metro.forEach((m,i) =>{
			t = t + m.displayName;
			control.metro.length - 1 > i ? t = t  + "|":{};
		})
		return t
	}

	var classes = {menuHeader:"menuHeader",list:"list",root:"root",nested:"nested"};
	const familyClasses = useStylesFamilies();

	//todo: need to test this with more events
	function getFamilyClass(event){
		//console.log("$event",event);
		//console.log("getFamilyClass",event.performance[0].displayName + " | " +event.performance[0].artist.familyAgg);
		//debugger;

		//go thru all performances and determine what family to represent it with
		var eventAgg = [];
		event.performance.forEach(p =>{
			//testing: start with headline for now
			if(p.billing == 'headline'){
				eventAgg.push(p.artist.familyAgg)
			}
		})
		if(eventAgg[0]){

			//console.log("chose family:",familyClasses[eventAgg[0] + '2']);
			return familyClasses[eventAgg[0] + '2']
		}else{
			//we don't want the non-familied events showing up with the 'grey' from 'unknown' families
			//like the chips do
			return null
		}

	}
	//

	// if the menu item doesn't have any child, this method simply returns a clickable menu
	// item that redirects to any location and if there is no child this method uses recursion to go until
	// the last level of children and then returns the item by the first condition.
	function handler(children,key) {

		// var moment = function(dt,format){
		// 	//console.log("$m",Moment(dt).format(format));
		// 	if(dt.length){
		// 		dt[0] ? dt = dt[0]:dt = dt[1]
		// 	}
		// 	if(Moment(dt).format(format) !== 'Invalid date'){
		// 		return(<React.Fragment> {Moment(dt).format(format)} </React.Fragment>) //basically you can do all sorts of the formatting and others
		// 	}else{return ""}
		// };

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
							primary={ showPlay(subOption)}
							secondary={
								<React.Fragment>

									{/*<div style={{display:"flex"}}>*/}
									{/*	<div>*/}
									{/*	</div>*/}
									{/*	<div>*/}
									<div>{subOption.id}</div>
									<ChipsArray familyAgg={subOption.artist.familyAgg} chipData={subOption.artist.genres}>
									</ChipsArray>
									{/*	</div>*/}
									{/*</div>*/}

									{/*{subOption.venue.displayName} -*/}
									{/*{subOption.location.city.toString().replace(", US","")}*/}
								</React.Fragment>
							}
						/>
					</div>
				);
			}
			return (
				<div key={subOption.id} className={getFamilyClass(subOption)}>
					<ListItem   button onClick={() => handleClick(subOption.id)}>
						{unHolyDrill(subOption) && <img src={spotifyLogo} style={{"position":"absolute","left":"52px","top":"2px",zIndex:"100",height:"1em",width:"1em"}} />}
						<ListItemText
							inset
							primary={ subOption.displayName.toString().replace(/at.*/,"")}
							secondary={
								<React.Fragment>
									<ArtistImageFader item={subOption}/>
									<Typography
										component={'span'}
										variant="body2"
										color="textPrimary"
									>
										{/*https://moment.github.io/luxon/docs/manual/formatting.html*/}
										{DateTime.fromISO(subOption.start.datetime).toFormat('LLL d')},{'\u00A0'}
										{DateTime.fromISO(subOption.start.datetime).toFormat('t')}{'\u00A0'}
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

	function getCoverage(events){
		var c_familyAgg = 0,c_genres = 0,c_eventsWithOne = 0;
		events.forEach(e =>{
			var ec = 0;
			e.performance.forEach(p =>{
				p.artist.familyAgg ? c_familyAgg++ :{};
				p.artist.familyAgg ? ec++ :{};
				p.artist.genres.length > 0 ? c_genres++ :{};
			})
			ec >0 ? c_eventsWithOne++:{};

		})
		return <div>agg:{c_familyAgg} genres:{c_genres} eventsWithOne: {c_eventsWithOne} total: {events.length} </div>
	}

	return (
		<div style={{display:"flex",flexDirection:"column"}}>
			{/*<div>*/}
			{/*	<List*/}
			{/*		component="nav"*/}
			{/*		aria-labelledby="nested-list-subheader"*/}
			{/*		className={classes.root}*/}
			{/*	>*/}
			{/*		*/}
			{/*	</List>*/}
			{/*</div>*/}

			<div>

				<List>
					<ListItem button divider key={'stats'} onClick={handleClickConfig3}>
						Stats!
						{open3 ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse key={'stats-collapse'}  in={open3} timeout="auto" unmountOnExit>
						<Stats></Stats>
					</Collapse>
					<ListItem button divider key={'locdate'} onClick={handleClickConfig}>
						<ListItemText primary={<div>Location & Date <div style={{background:'#80808026',display:"inline-block"}}>{getTitle()}</div></div>} />
						{open ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse key={'locdate-collapse'}  in={open} timeout="auto" unmountOnExit>
						<Map default={{"displayName":"Columbus", "id":9480}}></Map>
					</Collapse>
					{/*<ListItem button divider onClick={handleClickConfig}>*/}
					{/*	<ListItemText primary="Inbox" />*/}
					{/*	{open ? <ExpandLess /> : <ExpandMore />}*/}
					{/*</ListItem>*/}
					{/*<Collapse in={open} timeout="auto" unmountOnExit>*/}
					{/*	<List component="div" disablePadding>*/}
					{/*		<ListItem button className={classes.nested}>*/}
					{/*			<ListItemText primary="Starred" />*/}
					{/*		</ListItem>*/}
					{/*	</List>*/}
					{/*</Collapse>*/}
					<ListItem key={'events'} button divider onClick={handleClickConfig2}>
						<ListItemText primary={<div>Events ({globalState.events.length}) {getCoverage(globalState.events)}</div>} />
						{open2 ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse  key={'events-collapse'}  in={open2} timeout="auto" unmountOnExit>
						<div style={{marginTop:"1em",marginBottom:"1em"}} key={'special'}><CreatePlay/></div>
						{handler(globalState.events)}
					</Collapse>

				</List>
			</div>
		</div>
	);
}
// export default withStyles(styles)(MenuBar_class)
export default EventsList
