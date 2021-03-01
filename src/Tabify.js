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
import {Context} from "./storage/Store";
//import alasqlAPI from "./alasql";
import api from "./api/api.js"

import ChipsArray from "./ChipsArray";
import Search from './Search'
import util from "./util/util";
import tables from "./storage/tables";
import _ from "lodash";
import {Control, StatControl} from "./index";
import DiscreteSlider from "./Slider";
import {initUser} from './storage/Store';
import { GLOBAL_UI_VAR } from './storage/withApolloProvider';
import {useQuery,useReactiveVar} from "@apollo/react-hooks";
import Home from './components/Home';
import Social from "./components/Social";

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
	const [globalState, globalDispatch] = useContext(Context);



	//const params = JSON.parse(localStorage.getItem('params'));
	//console.log("$params",params);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);


		//{id:'dacandyman01',name:"Franky"};
	//console.log("$globalUI",globalUI);
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
		userProms.push(api.getMyFollowedArtists(req))
		userProms.push(api.getTopArtists(req))
		userProms.push(api.getRecentlyPlayedTracks(req))
		userProms.push(api.getUserPlaylistFriends(req))
		Promise.all(userProms)
			.then(r =>{

				//testing:
				//probably should be happening on the back
				r[0].forEach(a =>{a.source = 'saved'})
				r[1].forEach(a =>{a.source = 'top'})

				//all these artist's have 'sources' so they all end up in here together
				var pay = [];pay = pay.concat(r[0]);pay= pay.concat(r[1]);
				//pay= pay.concat(r[2]['artists'])

				globalDispatch({type: 'init', payload:pay,user: globalUI.user,context:'artists'});
				globalDispatch({type: 'init', payload:r[2].tracks,user: globalUI.user,context:'tracks'});
				globalDispatch({type: 'init', payload:r[3],user: globalUI.user,context:'spotifyusers'});
			},err =>{
				console.log(err);
			})

		api.fetchPlaylistsResolved(req)
			.then(r =>{
				console.log("r.stats",r.stats);
				globalDispatch({type: 'init', payload: r.playlists,user: globalUI.user,context:'playlists'});

			},err =>{
				console.log(err);
			})

	},[]);


	//-------------------------------------------------------------------------------------
	let control = Control.useContainer();

	//anytime metro selection changes, we recalc events based on the state of the new selection
	//todo: this executes a fetch on every metro selection switch
	//but in reality we should be caching

	useEffect(() => {
		if(globalState.events.length === 0){
			//console.log("ONE TIME EVENT FETCH");
			api.fetchEvents({metros:control.metro})
				.then(r =>{
					globalDispatch({type: 'update_events', payload: r,context:'events', control:control});
				},err =>{
					console.log(err);
				})
		}else{
			console.log("UPDATING ON METRO SELECT",control.metro);
			globalDispatch({type: 'update_events', payload: [],context:'events', control:control});
		}

	},[control.metro,control.startDate,control.endDate])

	//-----------------------------
	//sending this along 'seemed' to work but didn't test hard
	//testing: apollo reactive (dispatch below)
	//const globalState = useReactiveVar(GLOBAL_STATE_VAR);
	//-----------------------------



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

		globalDispatch({type: 'select', payload:null,user: globalUI.user,context:'artists',control:control,stats:statcontrol});
		//dispatch({type: 'select', payload:null,user:user,context:'artists',state:state:globalState});
	}


	var handleSelectPlaylist= function(rows){
		//todo: confused on how to get selected row?
		//seems like it should be pretty simple?
		//for now just take one - otherwise do a delta? :(
		console.log("selected",rows.length);
		globalDispatch({type: 'select', payload:rows[0],user: globalUI.user,context:'playlists',control:control,stats:statcontrol});
	}

	var handleSelectRecent= function(rows){
		globalDispatch({type: 'select', payload:null,user: globalUI.user,context:'tracks',control:control,stats:statcontrol});
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

	//----------------------------------------------------------------------------
	let statcontrol = StatControl.useContainer();

	const tabMap = {library:{
			0:"artists_saved",
			1:"playlists"
		},profile:{
			0:"home",
			1:"recent",
			2:"artists_top"
		},friends:{0:"friends"}}
	const tabContextMap = {artists_saved:"artists",artists_top:"artists",playlists:"playlists",home:"home",recent:"recent",friends:"friends"}	;
	const secMap ={0:"profile",1:"library",2:"friends"}
	const [tabs, setActiveTab] = useState({library:0,profile:0,friends:0});
	const [section, setActiveSection] = useState(0);
	function handleTabSelect(section,key){
		// console.log("handleTabSelect",section);
		// console.log(key);
		setActiveTab({...tabs,[section]:key})
		statcontrol.setStats({name:tabMap[section][key]})

		//testing: can't use statcontrol.stats value immediately
		//so I recreate the stats object I'd want to send...yeaaaaaah

		globalDispatch({type: 'update', payload: null,user: globalUI.user,context:tabContextMap[tabMap[section][key]],
			stats:{stats: {name:tabMap[section][key]},mode:statcontrol.mode},control:control});
	}

	function handleSectionSelect(sectionkey){
		//if the section changed, also trigger tab set (0 as default)
		if(sectionkey !== section){
			 handleTabSelect(secMap[sectionkey],0)
		}
		setActiveSection(sectionkey)
	}

	//-----------------------------

	const options = {
		search: true,
		// filtering: true,
		sorting: true,
		// selection: false,
		tableLayout:"fixed",
		paging:true,
		pageSize:10,
		searchFieldStyle:{marginRight:"1em"},
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
			<Tabs activeKey={section} onSelect={handleSectionSelect} theme={theme} >
				{/*todo: disabled for now (broke in multiple places)*/}
				{/*<Tab label="Search">*/}
				{/*	<Search></Search>*/}
				{/*</Tab>*/}
				<Tab label="My Profile">
					<Tabs activeKey={tabs['profile']} onSelect={handleTabSelect.bind(null,'profile')}>
						<Tab label="Home">

							<Home data={globalState[ globalUI.user.id + "_artists"].filter(i =>{return i.term})} />
						</Tab>
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
								data={globalState[ globalUI.user.id + "_tracks"]}
								options={{...options,selection:!(statcontrol.mode)}}
								icons={icons}
								onSelectionChange={(rows) => handleSelectRecent(rows,'recent')}
							/>
						</Tab>
						<Tab label="Your Top Artists">
							{/*<div>{term.toString()}</div>*/}
							<DiscreteSlider defaultValue={1} handleChange={(v) =>{setTerm(v)}}/>
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
								data={globalState[ globalUI.user.id + "_artists"].filter(i =>{return i.term === term})}
								options={{...options,selection:!(statcontrol.mode)}}
								onSelectionChange={(rows) => handleSelectSaved(rows,'top')}
							/>

						</Tab>
					</Tabs>
				</Tab>
				<Tab label="My Library">
					<Tabs activeKey={tabs['library']} onSelect={handleTabSelect.bind(null,'library')}>
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
								data={globalState[ globalUI.user.id + "_artists"].filter(i =>{return i.source === 'saved'})}
								options={{...options,selection:!(statcontrol.mode)}}
								onSelectionChange={(rows) => handleSelectSaved(rows,'saved')}
							/>

						</Tab>
						<Tab label="Playlists" >
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
								data={globalState[ globalUI.user.id + "_playlists"]}
								options={{...options,selection:!(statcontrol.mode)}}
								onSelectionChange={(rows) => handleSelectPlaylist(rows)}
							/>


						</Tab>
						<Tab label="Subtab 1.3">Tab 1 Content 3</Tab>
					</Tabs>
				</Tab>
				<Tab label="My Friends">
					<Tabs>
						<Tab label="Look Dan your very own tab">
							<Social/>
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
