import React, {useContext, useEffect, useState,useRef,forwardRef } from 'react';
//todo: this shit is outdated AF but was so simple I couldn't refuse
//https://github.com/mikechabot/react-tabify#color-theme
//specifically it uses glamorous which has been ditched for emotion as a theme provider
//not sure if I could rip that dependency out myself and just make this my thing or not...
import { Tab, Tabs } from "react-tabify";
import MaterialTable from "material-table";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import {Context} from "./alasql/Store";
import alasqlAPI from "./alasql";
import api from "./api/api.js"

import ChipsArray from "./ChipsArray";
import Search from './Search'
import util from "./util/util";
import tables from "./alasql/tables";
import _ from "lodash";
import {Control} from "./index";
import DiscreteSlider from "./Slider";
import {initUser} from './alasql/Store';
import { GLOBAL_UI_VAR } from './alasql/withApolloProvider';
import {useQuery,useReactiveVar} from "@apollo/react-hooks";


// const styles = {
// 	fontFamily: "sans-serif",
// 	textAlign: "center"
// };

//todo: also this shit doesn't even work?
//whatever fuck it for now
var color = "#000000";
var materialColor = "#3f51b5";

const theme = {
	tabs: {
		color: color,
		borderBottomColor: color,
		active: {
			borderBottomColor: color,
			color: "#3273dc"
		},
		hover: {
			borderBottomColor: color,
			color: color
		}
	},
	menu: {
		color: color,
		borderRight: color,
		active: {
			backgroundColor: color,
			color: color
		},
		hover: {
			color: color,
			backgroundColor: color
		}
	}
};

function getChips(genres){

	var t = ""
	genres.forEach(g =>{
		t =t + g.name + ", "
	})
	return <span>{t}</span>

};




export default function Tabify() {

	//todo: move this somewhere else higher up
	//todo: rename this instance to 'global state'
	const [state, dispatch] = useContext(Context);

	//const params = JSON.parse(localStorage.getItem('params'));
	//console.log("$params",params);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	console.log("$globalUI",globalUI);
	//note: to be used as a base for every request

	//todo: put user in
	let req = {user:null,auth:globalUI};

	function useDidUpdateEffect(fn,inputs) {
		const didMountRef = useRef(false);
		console.log("$useDidUpdateEffect");
		useEffect(() => {
			if (didMountRef.current)
			{ 	console.log("2nd mount w/ token change!!");
				fn()
			}
			else{
				console.log("$current",true);
				didMountRef.current = true;

			}

		}, inputs);
	}


	//prevent useeffect from triggering on first render
	//essentially adding a dependency of '2nd render = true'
	//https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
	var slow = function(){ setTimeout(e=>{console.log("do something");},2000)}


	useEffect(() => {

		var userProms = [];
		userProms.push(alasqlAPI.followedArtists(req))
		userProms.push(alasqlAPI.getTopArtists(req))
		userProms.push(api.getRecentlyPlayedTracks(req))
		Promise.all(userProms)
			.then(r =>{

				//testing:
				//probably should be happening on the back
				r[0].forEach(a =>{a.source = 'saved'})
				r[1].forEach(a =>{a.source = 'top'})

				//all these artist's have 'sources' so they all end up in here together
				var pay = [];pay = pay.concat(r[0]);pay= pay.concat(r[1]);
				//pay= pay.concat(r[2]['artists'])

				dispatch({type: 'init', payload:pay,user:user,context:'artists'});
				dispatch({type: 'init', payload:r[2].tracks,user:user,context:'tracks'});
			},err =>{
				console.log(err);
			})

		alasqlAPI.fetchPlaylistsResolved(req)
			.then(r =>{
				dispatch({type: 'init', payload: r,user:user,context:'playlists'});
			},err =>{
				console.log(err);
			})

		//note: decided I would do this on demand for clicks around the app
		//(so currently not in use)
		//but for events - I would do the lookup on the server ahead of time
		// alasqlAPI.getArtistTopTracks('2dI9IuajQnLR5dLxHjTTqU')
		// 	.then(r =>{
		// 		console.log("$getArtistTopTracks",r);
		// 	},err =>{
		// 		console.log(err);
		// 	})

		//todo: what does this do again? was this for other users or what?
		// alasqlAPI.fetchPlaylists()
		// 	.then(r =>{
		// 		dispatch({type: 'init', payload: r,user:user,context:'playlists'});
		// 	},err =>{
		// 		console.log(err);
		// 	})
	},[]);


	//-----------------------------
	let control = Control.useContainer();

	//testing: beware naming (there's another dispatch around)
	const [globalState, dispatchGlobal] = useContext(Context);

	//anytime metro selection changes, we recalc events based on the state of the new selection
	//todo: this executes a fetch on every metro selection switch
	//but in reality we should be caching

	useEffect(() => {
		if(globalState.events.length === 0){
			//console.log("ONE TIME EVENT FETCH");
			alasqlAPI.fetchEvents({metros:control.metro})
				.then(r =>{
					dispatch({type: 'update', payload: r,context:'events', control:control});
				},err =>{
					console.log(err);
				})
		}else{
			console.log("UPDATING ON METRO SELECT",control.metro);
			dispatch({type: 'update', payload: [],context:'events', control:control});
		}

	},[control.metro,control.startDate,control.endDate])

	//-----------------------------
	//sending this along 'seemed' to work but didn't test hard
	//testing: apollo reactive (dispatch below)
	//const globalState = useReactiveVar(GLOBAL_STATE_VAR);
	//-----------------------------

	//todo:
	var playlists = [];
	var user = {id:'dacandyman01',name:"Franky"};

	const CustomSelect = (props) => {
		const [date, setDate] = useState("");
		//console.log("CustomSelect",props);
		const handleChange = (event) => {
			setDate(event.target.value);
			props.onFilterChanged(props.columnDef.tableData.id, event.target.value);
		};
		return (
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={date}
				onChange={handleChange}
			>
				<MenuItem value={null}>&nbsp;&nbsp;&nbsp;</MenuItem>
				{props.options.map((op, index) => (
					<MenuItem key={index} value={op}>{op}</MenuItem>
				))}
			</Select>
		);
	};

	var generateOps = function(playlists){
		var owners = [];
		playlists.forEach(p =>{
			owners.indexOf(p.owner.display_name)  === -1 ? owners.push(p.owner.display_name):{};
		});
		return owners;
	};

	var handleSelectSaved = function(rows){
		//confused on how to get selected row? seems like it should be pretty simple?
		//turns out I'm just accessing the 'checked' rows directly later, so null payload here
		//console.log("selected",rows.length);
		//testing: wanted to somehow reuse the dispatch here
		//but can't (easily - maybe could pass the current state value here)
		//access the current state value

		dispatch({type: 'select', payload:null,user:user,context:'artists',control:control});
		//dispatch({type: 'select', payload:null,user:user,context:'artists',state:state:globalState});
	}
	var handleSelectGuest = function(rows){
		//here I'm just accessing the 'checked' rows directly later, so null payload here
		//console.log("selected",rows.length);

		dispatch({type: 'select', payload:null,user:user,context:'artists',control:control});


	}

	var handleSelectPlaylist= function(rows){
		//todo: confused on how to get selected row?
		//seems like it should be pretty simple?
		//for now just take one - otherwise do a delta? :(
		console.log("selected",rows.length);
		dispatch({type: 'select', payload:rows[0],user:user,context:'playlists',control:control});
	}

	var handleSelectRecent= function(rows){
		dispatch({type: 'select', payload:null,user:user,context:'tracks',control:control});
	}


	function getRandomInt(max) {
		max = 99999999;
		return Math.floor(Math.random() * Math.floor(max));
	}
	var prepPlay = function(playob,mode){


		var chips = [];

		switch(mode) {
			case 'families':
				//for every artist in the playlist, get the family freq on them w/ familyFreq.
				//use makeRank to produce an array of families that represents the weight of artists' genres' families over the playlist
				//now take the chips that best represent the playlist

				//todo: repeated code (Pie.js also needs this rank to determine node content)
				//@ else if(a.artists)

				//take top 5
				var rank = util.makeRank(playob.artists,playob.artistFreq,"familyAgg");


				for(var x =0;x < rank.length ; x++){
					chips.push({id:getRandomInt(),name:Object.keys(rank[x])[0]})
				}
				break;
			case 'artists':
				//separate chips for top artists

				var artists = [];
				var artistsSorted = [];
				//console.log("$prepPlay",playob);
				Object.keys(playob.artistFreq).forEach(k =>{
					//todo: should be faster lookup on actual db
					tables["artists"].forEach(a =>{
						k === a.id ?  artists.push({id:a.id,name:a.name,freq:playob.artistFreq[k],familyAgg:a.familyAgg}):{};
					})
				})
				artistsSorted = _.sortBy(artists, function (r) {return r.freq}).reverse()
				//debugger;
				//take top 3
				//console.log("$artists",artistsSorted);
				for(var x =0;x < 3 && x < artistsSorted.length  ; x++){
					chips.push({id:getRandomInt(),name:artistsSorted[x].name,familyAgg:artistsSorted[x].familyAgg})
				}
				break;
			case'genres':
				//todo: chips for top 5 unique genres
				//not sure exactly how to represent this...really I want to like
				//click and expand on th family names? top genre's doesn't really make any sense
				//displayed if disconnected from families?

				var rank = util.makeRank2(playob.artists,playob.artistFreq);
				for(var x =0;x < 3 && x < rank.length  ; x++){
					chips.push({id:getRandomInt(),name:Object.keys(rank[x])[0]})
				}
				break;
			default:
			// code block
		}

		return 	<ChipsArray chipData={chips}/>
	}


	//terms
	const [term, setTerm] = useState('medium');
	function handleChange(event, newValue) {
		console.log("$newValue",newValue);
		setTerm(newValue);
	}

	//testing: not being sent yet
	var guest = {id:123028477,name:"Dan"};
	function setStatic(){
		alasqlAPI.fetchStaticUser()
			.then(r =>{
				initUser(guest);
				dispatch({type: 'init', user:guest,payload:r[0].data,context:'artists'});
			},err =>{
				console.log(err);
			})
	}

	function prepTracks(rowData){
		//console.log("$prepTracks",rowData);
		var genres = [];
		rowData.artists.forEach(a =>{
			genres = genres.concat(a.genres)
		});
		genres = _.uniqBy(genres, function(n) {return n.id;});
		//return <div></div>
		return(<ChipsArray chipData={genres}/>)
	}

	function handlePlay(item) {
		console.log("$handlePlay",item);
		control.setId(item.id);
		control.togglePlay(!control.play);
	}

	const options = {
		search: true,
		filtering: true,
		selection: true,
		tableLayout:"fixed",
		paging:true,
		pageSize:10,
		showFirstLastPageButtons:false,
		pageSizeOptions:[10,20,30],
	}
	const icons = { SortArrow: forwardRef((
			props,
			ref) => <ArrowDropDownIcon{...props} ref={ref}/>),
		Search: forwardRef((
			props,
			ref) => <div{...props} ref={ref}/>),
		ResetSearch: forwardRef((
			props,
			ref) => <ClearIcon{...props} ref={ref}/>),
		NextPage: forwardRef((
			props,
			ref) => <ArrowForwardIosIcon{...props} ref={ref}/>),
		PreviousPage: forwardRef((
			props,
			ref) => <ArrowBackIosIcon{...props} ref={ref}/>)
	}

	return(
		// style={styles}
		<div>
			<Tabs theme={theme} >
				{/*todo: disabled for now (broke in multiple places)*/}
				{/*<Tab label="Search">*/}
				{/*	<Search></Search>*/}
				{/*</Tab>*/}
				<Tab label="My Profile">
					<Tabs>
						<Tab label="Recent Listening">
							<MaterialTable
								title=""
								columns={[
									{
										field: 'album.images[0]',
										title: '',
										render: rowData => <img src={rowData.album.images[0].url} style={{width: 50, borderRadius: '50%'}}/>,
										filtering:false,
										width:"5em"
									},
									{ title: 'Name', field: 'name', filtering:false,
										render: rowData =>
											<div>
												<span><PlayCircleOutlineIcon
													fontSize={'small'} onClick={() => handlePlay(rowData)}>
												</PlayCircleOutlineIcon></span>
												<span>{rowData.name}</span>
												<div style={{fontSize:".9em",color:"#a4a4a4"}}>
													by {rowData.artists.map((item,i) => (
													<span  key={item.id}>
													<span>{item.name}</span>
														{rowData.artists.length - 1 > i && <span>,{'\u00A0'}</span>}
												</span>
												))}
												</div>
											</div>},
									{
										field: 'genres',
										title: 'genres',
										//ender: rowData => getChips(rowData.genres),
										render: rowData => prepTracks(rowData),
										filtering:false,
										width:"20em"
									},

								]}
								data={state[user.id + "_tracks"]}
								options={options}
								icons={icons}
								onSelectionChange={(rows) => handleSelectRecent(rows,'recent')}
							/>
						</Tab>
						<Tab label="Your Top Artists">
							{/*<div>{term.toString()}</div>*/}
							<DiscreteSlider handleChange={(v) =>{setTerm(v)}}/>
							<MaterialTable
								title=""
								columns={[
									{
										field: 'images[0]',
										title: '',
										render: rowData => <img src={rowData.images[0].url} style={{width: 50, borderRadius: '50%'}}/>,
										filtering:false,
										width:"5em"
									},
									{ title: 'Name', field: 'name', filtering:false},
									{
										field: 'genres',
										title: 'genres',
										//ender: rowData => getChips(rowData.genres),
										render: rowData => <ChipsArray chipData={rowData.genres}/>,
										filtering:false,
										width:"20em"
									},

								]}
								data={state[user.id + "_artists"].filter(i =>{return i.term === term})}
								options={{
									search: true,
									filtering: true,
									selection: true,
									tableLayout:"fixed"
								}}
								onSelectionChange={(rows) => handleSelectSaved(rows,'top')}
							/>

						</Tab>
						<Tab label="Subtab 2.3">Tab 2 Content 3</Tab>
					</Tabs>
				</Tab>
				<Tab label="My Library">
					<Tabs>
						<Tab label="Saved Artists">

							<MaterialTable
								title=""
								columns={[
									{
										field: 'images[0]',
										title: '',
										render: rowData => <img src={rowData.images[0].url} style={{width: 50, borderRadius: '50%'}}/>,
										filtering:false,
										width:"5em"
									},
									{ title: 'Name', field: 'name', filtering:false},
									{
										field: 'genres',
										title: 'genres',
										//ender: rowData => getChips(rowData.genres),
										render: rowData => <ChipsArray chipData={rowData.genres}/>,
										filtering:false,
										width:"20em"
									},

								]}
								data={state[user.id + "_artists"].filter(i =>{return i.source === 'saved'})}
								options={{
									search: true,
									filtering: true,
									selection: true,
									tableLayout:"fixed"
								}}
								onSelectionChange={(rows) => handleSelectSaved(rows,'saved')}
							/>

						</Tab>
						<Tab label="Playlists">
							{/*note: customizing material table
							- the default search works on text provided by the column's 'field' attribute
							- thinking 'customFilterAndSearch' can be used to setup searches for custom rendered columns
							  https://github.com/mbrn/material-table/issues/67

							*/}
							<MaterialTable
								icons={icons}
								title=""
								columns={[
									{
										field: 'name',
										title: '',
										render: rowData =>
											<div>
												<div>{rowData.name}</div>
												<img src={rowData.images[0].url} style={{width: 50, borderRadius: '50%'}}/>
												<div style={{fontSize:".7em",color:"#a4a4a4"}}>{rowData.owner.display_name}</div>
											</div>,
										// sorting:false,
										width:"10em"
									},
									//testing: not sure where to put this yet
									//was thinking maybe under 'Top Genres' could have 'see families' which would expose
									//how those genres map up into famlilies

									// {
									// 	field: 'families',
									// 	title: 'families',
									// 	//ender: rowData => getChips(rowData.genres),
									// 	render: rowData => prepPlay(rowData,'families'),
									// 	filtering:false,
									// 	width:"20em"
									// },
									{
										field: 'artists',
										title: 'Top Artists',
										render: rowData => prepPlay(rowData,'artists'),
										// customFilterAndSearch: (value, rowData) => {
										// 	//todo:
										// },
										sorting:false,
										width:"20em"
									},
									{
										field: 'genres',
										title: 'Top Genres',
										//ender: rowData => getChips(rowData.genres),
										render: rowData => prepPlay(rowData,'genres'),
										sorting:false,
										width:"15em"
									},
									{
										field: 'tracks.total',
										title: 'Length',
										//ender: rowData => getChips(rowData.genres),
										render: rowData =>
											<div>
												{rowData.tracks.total}
											</div>,
										sorting:true,
										customSort: (a, b) => a.tracks.total - b.tracks.total,
										width:"15em"
									},
								]}
								data={state[user.id + "_playlists"]}
								options={{
									search: true,
									searchFieldStyle:{marginRight:"1em"},
									sorting: true,
									selection: true,
									tableLayout:"fixed",
									paging:true,
									pageSize:10,
									showFirstLastPageButtons:false,
									pageSizeOptions:[10,20,30],
								}}
								onSelectionChange={(rows) => handleSelectPlaylist(rows)}
							/>


						</Tab>
						<Tab label="Subtab 1.3">Tab 1 Content 3</Tab>
					</Tabs>
				</Tab>
				<Tab label="My Friends">
					<Tabs>
						<Tab label="Look Dan your very own tab">

							<button onClick={setStatic}>getstuff</button>
							<DiscreteSlider handleChange={(v) =>{setTerm(v)}}/>

							{/*todo: disable for now until content shown*/}
							{state[guest.id + "_artists"] && <MaterialTable
								title=""
								columns={[
									{
										field: 'images[0]',
										title: '',
										render: rowData => <img src={rowData.images[0].url} style={{width: 50, borderRadius: '50%'}}/>,
										filtering:false,
										width:"5em"
									},
									{ title: 'Name', field: 'name', filtering:false},
									{
										field: 'genres',
										title: 'genres',
										//ender: rowData => getChips(rowData.genres),
										render: rowData => <ChipsArray chipData={rowData.genres}/>,
										filtering:false,
										width:"20em"
									},

								]}
								data={state[guest.id + "_artists"].filter(i =>{return i.term === term})}
								options={{
									search: true,
									filtering: true,
									selection: true,
									tableLayout:"fixed"
								}}
								onSelectionChange={(rows) => handleSelectGuest(rows,'top')}
							/>
							}

						</Tab>
						<Tab label="Subtab 3.2">Tab 3 Content 2</Tab>
						<Tab label="Subtab 3.3">Tab 3 Content 3</Tab>
					</Tabs>
				</Tab>
				<Tab label="Billboards">
					<Tabs>
						<Tab label="Subtab 2.1">Tab 2 Content 1</Tab>
						<Tab label="Subtab 2.2">Tab 2 Content 2</Tab>
						<Tab label="Subtab 2.3">Tab 2 Content 3</Tab>
					</Tabs>
				</Tab>
			</Tabs>
		</div>
	)
}
