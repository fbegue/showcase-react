import React, {useContext, useEffect, useState} from 'react';
//todo: this shit is outdated AF but was so simple I couldn't refuse
//https://github.com/mikechabot/react-tabify#color-theme
//specifically it uses glamorous which has been ditched for emotion as a theme provider
//not sure if I could rip that dependency out myself and just make this my thing or not...
import { Tab, Tabs } from "react-tabify";
import MaterialTable from "material-table";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Context} from "./alasql/Store";
import alasqlAPI from "./alasql";

import ChipsArray from "./ChipsArray";
import Search from './Search'
import util from "./util/util";
import tables from "./alasql/tables";
import _ from "lodash";
import {Control} from "./index";


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
	const [state, dispatch] = useContext(Context);

	useEffect(() => {

		//testing:
		alasqlAPI.followedArtists(user)
			.then(r =>{
				dispatch({type: 'init', payload: r,user:user,context:'artists'});
			},err =>{
				console.log(err);
			})

		alasqlAPI.fetchPlaylistsResolved()
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


		// alasqlAPI.fetchPlaylists()
		// 	.then(r =>{
		// 		dispatch({type: 'init', payload: r,user:user,context:'playlists'});
		// 	},err =>{
		// 		console.log(err);
		// 	})
	},[]);


	//-----------------------------
	let control = Control.useContainer();

	useEffect(() => {
		console.log("useEffect fetchEvents on control.metro dependency update",control.metro);
		//todo: put date picker

		alasqlAPI.fetchEvents({metro:{id:control.metro}})
			.then(r =>{
				dispatch({type: 'init', payload: r,context:'events'});
			},err =>{
				console.log(err);
			})
	},[control.metro])

	//-----------------------------


	//todo:
	var playlists = [];
	var user = 'dacandyman01';

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
		//todo: confused on how to get selected row?
		//seems like it should be pretty simple?
		//for now just take one - otherwise do a delta? :(
		console.log("selected",rows.length);
		dispatch({type: 'select', payload:rows[0],user:user,context:'artists'});
	}

	var handleSelectPlaylist= function(rows){
		//todo: confused on how to get selected row?
		//seems like it should be pretty simple?
		//for now just take one - otherwise do a delta? :(
		console.log("selected",rows.length);
		dispatch({type: 'select', payload:rows[0],user:user,context:'playlists'});
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
				Object.keys(playob.artistFreq).forEach(k =>{
					//todo: should be faster lookup on actual db
					tables["artists"].forEach(a =>{
						k === a.id ?  artists.push({id:a.id,name:a.name,freq:playob.artistFreq[k]}):{};
					})
				})
				artistsSorted = _.sortBy(artists, function (r) {return r.freq}).reverse()

				//take top 3
				//console.log("$artists",artistsSorted);
				for(var x =0;x < 3 && x < artistsSorted.length  ; x++){
					chips.push({id:getRandomInt(),name:artistsSorted[x].name})
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

	return(
		// style={styles}
		<div>
			<Tabs theme={theme} >
				<Tab label="Search">
					<Search></Search>
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
								data={state[user + "_artists"]}
								options={{
									search: true,
									filtering: true,
									selection: true,
									tableLayout:"fixed"
								}}
								onSelectionChange={(rows) => handleSelectSaved(rows)}
							/>

						</Tab>
						<Tab label="Playlists">
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
										field: 'families',
										title: 'families',
										//ender: rowData => getChips(rowData.genres),
										render: rowData => prepPlay(rowData,'families'),
										filtering:false,
										width:"20em"
									},
									{
										field: 'artists',
										title: 'Top Artists',
										//ender: rowData => getChips(rowData.genres),
										render: rowData => prepPlay(rowData,'artists'),
										filtering:false,
										width:"20em"
									},
									{
										field: 'genres',
										title: 'Top Genres',
										//ender: rowData => getChips(rowData.genres),
										render: rowData => prepPlay(rowData,'genres'),
										filtering:false,
										width:"20em"
									},

								]}
								data={state[user + "_playlists"]}
								options={{
									search: true,
									filtering: true,
									selection: true,
									tableLayout:"fixed"
								}}
								onSelectionChange={(rows) => handleSelectPlaylist(rows)}
							/>


						</Tab>
						<Tab label="Subtab 1.3">Tab 1 Content 3</Tab>
					</Tabs>
				</Tab>
				<Tab label="My Profile">
					<Tabs>
						<Tab label="Subtab 2.1">Tab 2 Content 1</Tab>
						<Tab label="Subtab 2.2">Tab 2 Content 2</Tab>
						<Tab label="Subtab 2.3">Tab 2 Content 3</Tab>
					</Tabs>
				</Tab>
				<Tab label="My Friends">
					<Tabs>
						<Tab label="Subtab 3.1">Tab 3 Content 1</Tab>
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