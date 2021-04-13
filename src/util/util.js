import _ from "lodash";
import ChipsArray from "../ChipsArray";
import React, {useContext,useState,useEffect} from "react";
import tables from "../storage/tables";
import {families as systemFamilies, familyColors} from "../families";
import {Highlighter, StatControl,FriendsControl} from "../index";
import {Context} from "../storage/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR} from "../storage/withApolloProvider";

const uuid = require('react-uuid')

//this is going to be harder b/c we already setup familyAgg ...somewhere? whereTF did I set that up
//anyways now that I'm on my 3rd 'get some data' about these playlists I'm wondering if I should
//be trying to set this up in a different way..


//for each artist, for each genre, make a map entry where the weight of the genre is multiplied by the artistFreq
//todo: problem here tho is that a single artist just completely dominates?
//like if the idea is to give the 'top genres' then technically it is correct to let one artist dominate
//but really shouldn't I at least be looking at like 'top 3 artist's genres'?


function makeRank2(array,artistFreq){
	var gamap = {};

	//console.log("makeRank",JSON.parse(JSON.stringify(array)));
	//console.log(artistFreq);

	array.forEach(e =>{
		if(e.genres){
			e.genres.forEach(g =>{
				if(!(gamap[g.name])){
					gamap[g.name] = 1 * (artistFreq[e.id] ? artistFreq[e.id]:1)
				}
			})
		}
	})

	if (!(_.isEmpty(gamap))) {
		//convert map to array (uses entries and ES6 'computed property names')
		//and find the max
		var arr = [];
		Object.entries(gamap).forEach(tup => {
			var r = {[tup[0]]: tup[1]};
			arr.push(r);
		});
		var arrSorted = _.sortBy(arr, function (r) {
			return Object.values(r)[0]
		}).reverse()
		//var f =
		//console.log("%", f);
		//return Object.keys(m)[0];
		// console.log("$gamap",gamap);
		// console.log("$gamap",arrSorted);
		return arrSorted;
	}
};

//todo: started to make this general but got this familyAgg in here
//basically: iterate thru an array, creating a map of every item @ id, multiplying the value based on artistFreq
//returns a sorted array of those key-value pairs

var key = "familyAgg"
function makeRank(array,artistFreq){
	var pamap = {};
	//console.log("makeRank",JSON.parse(JSON.stringify(array)));
	//console.log(artistFreq);

	array.forEach(e =>{

		//console.log("$",e.familyAgg);
		//if we have the key we're interested in w/ non-null value
		if(e.familyAgg !== null){
			//if we haven't defined it yet on the map
			if (!(pamap[e[key]])) {

				//todo: how to weight w/ artistFreq
				//array should be unique artists, so just multiply by frequency to weight them?
				//if there is a artistFreq def for them (there should always be right? when is this not true?)

				if(artistFreq[e.id]){
					pamap[e[key]] = artistFreq[e.id]

				}else{
					pamap[e[key]] = 1
				}
			} else {
				if(artistFreq[e.id]){
					pamap[e[key]] = pamap[e[key]] + artistFreq[e.id]
				}else{
					pamap[e[key]]++;
				}
			}
		}
	})

	if (!(_.isEmpty(pamap))) {
		//convert map to array (uses entries and ES6 'computed property names')
		//and find the max
		var arr = [];
		Object.entries(pamap).forEach(tup => {
			var r = {[tup[0]]: tup[1]};
			arr.push(r);
		});
		//todo: could offer this
		// var m = _.maxBy(arr, function (r) {
		// 	return Object.values(r)[0]
		// });
		//instead this for now
		var arrSorted = _.sortBy(arr, function (r) {
			return Object.values(r)[0]
		}).reverse()
		//var f =
		//console.log("%", f);
		//return Object.keys(m)[0];

		return arrSorted;

	}
	return null;
}

function useCustomHook(){

	//const initialRender = useRef(true);

	const [isOnline, setIsOnline] = useState(null);
	return 'custom'
}

function useProduceData(){
	//so basically:
	// when you're only selecting data from one tab or switching between tabs, we only look at one node's data at a time
	// when you start combining tabs, the logic switches to accommodate many different item types

	let statcontrol = StatControl.useContainer();
	const [globalState, globalDispatch] = useContext(Context);
	let highlighter = Highlighter.useContainer();
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	let friendscontrol = FriendsControl.useContainer()

	const [pieData, setPieData] = useState([]);
	const [genres, setGenres] = useState([]);
	const [bubbleData, setBubbleData] = useState([]);
	const [vennData, setVennData] = useState([]);

	useEffect(() => {
		var data = [];
		var data_guest = [];

		var tempPieData = [];
		console.log("useEffect",statcontrol.stats.name);
		console.log("guest:",friendscontrol.guest.id);
		//console.log("tables",tables);

		//todo: duplicate code in reducer
		var contextFilter = function(key,rec) {
			var t = false;

			if (key === 'top') {
				t = rec['term'] !== null
			} else {
				t = rec['source'] === key
			}

			if (statcontrol.mode) {
				if (key) {return t}
				else {return true}
			}
		}

		//set data pointer based on current tab
		switch(statcontrol.stats.name) {
			case "artists_saved":
				//data = globalState[globalUI.user.id + "_artists"].filter(i =>{return i.source === 'saved'})
				//data = tables["users"][globalUI.user.id]["artists"].filter(contextFilter.bind(null,'saved'))
				data = globalState[globalUI.user.id + "_artists"].filter(contextFilter.bind(null,'saved'))
				break;
			case "artists_top":
				data = globalState[globalUI.user.id + "_artists"].filter(contextFilter.bind(null,'top'))
				break;
			case "artists_recent":
				data = globalState[globalUI.user.id + "_artists"].filter(contextFilter.bind(null,'recent'))
				break;
			case "playlists":
				//todo: may not have been stated yet
				if (tables["users"][globalUI.user.id]["playlists"]) {
					data = tables["users"][globalUI.user.id]["playlists"].filter(contextFilter.bind(null,null))
				}
				break;
			case "tracks_recent":
				data = globalState[globalUI.user.id + "_tracks"].filter(contextFilter.bind(null,'recent'))
				break;
			case "tracks_saved":
				data = globalState[globalUI.user.id + "_tracks"].filter(contextFilter.bind(null,'saved'))
				break;
			//	testing:
			case "123028477":
			case "friends":
				data = globalState[globalUI.user.id + "_artists"].filter(contextFilter.bind(null,'saved'))
				data_guest = globalState[friendscontrol.guest.id + "_artists"].filter(contextFilter.bind(null,'saved'))
				break;
			default:
				console.warn("skipped stat re-render for: " + statcontrol.stats.name)
				break;
		}

		console.log("data source switched",data);
		console.log("data source switched",data_guest);
		//based on the type of data coming in,
		//create a map for pie and bubblechart to unwrap later

		var map = {}
		var _genres =[];

		//todo: in every case, null familyAgg doesn't quite make sense?
		// think this was a notee to myself that I was getting some nulls that shouldn't be there?

		//todo: can decide to (initally) hide certain series w/ series property: visible
		//by default, toggleable by clicking on legend item

		data.forEach(d =>{

			//todo: this is many artists from many tracks
			//the abstraction is always going to not-perfectly represent the tracks themselves
			if(d.type === 'track'){
				d.artists.forEach(a =>{
					if(a.familyAgg && a.familyAgg !== null){
						if (!map[a.familyAgg]) {
							map[a.familyAgg] = {artists:{}}
						} else {
							//map[a.familyAgg].artists.push(a)
							if(map[a.familyAgg].artists[a.name]){map[a.familyAgg].artists[a.name]++}
							else{map[a.familyAgg].artists[a.name] = 1 }
						}
					}
					//testing: only genres from highlighted family
					if(highlighter.hoverState[0] === a.familyAgg){
						_genres = _genres.concat(a.genres)
					}

				});

			}else if(d.artists) {
				//playlists
				//todo: hard part is representing a playlist proportionately within itself
				//I have the familyAgg for each artist - so just make a ranking of these then using the artistFreq
				var rank = makeRank(d.artists, d.artistFreq, "familyAgg");
				//console.log("rank",rank);

				//testing: non-proportionate ranks
				//with bubble data, the playlist needs to be contained within a single family bubble
				//b/c otherwise it will be represented in more than a single node. with playlist ranking,
				//this means that I have to choose whatever fam represents the genre the most.
				//the values will all be equal for the node sizes b/c nothing else makes sense
				//(I can't really talk about the family content of a playlist I've already decided would be described by it's top rank)

				for (var x = 0; x < rank.length && x < 3; x++) {
					var fam = Object.keys(rank[x])[0];
					//!(map[fam]) ? map[fam] = 1 : map[fam]++
					if (!map[fam]) {
						map[fam] = {playlists:[d.name]}
					} else {
						map[fam].playlists.push(d.name)
						// if(map[fam].playlists[d.name]){map[fam].playlists[d.name]++}
						// else{map[fam].playlists[d.name] = 1 }
					}
				}
			}
			//todo: artists: familyAgg is good enough signifier here?
			else if(d.familyAgg && d.familyAgg !== null){

				//testing:
				//compare maps of each person for each family
				//compare the total # of artists for each family for each user:
				//- if both USER and GUEST have a decent number, that's an interesting genre for them to talk about
				//- if neither do - it's not
				//- and then something something math


				if (!map[d.familyAgg]) {
					map[d.familyAgg] = {artists:{}}
				} else {
					//map[d.familyAgg].artists.push(a)
					if(map[d.familyAgg].artists[d.name]){map[d.familyAgg].artists[d.name]++}
					else{map[d.familyAgg].artists[d.name] = 1 }
				}
			}else{
				console.error("malformed data passed to pie");
			}
		})

		//todo: duplicate (above)
		var map_guest =  {};
		data_guest.forEach(d =>{


			//todo: this is many artists from many tracks
			//the abstraction is always going to not-perfectly represent the tracks themselves
			if(d.type === 'track'){
				d.artists.forEach(a =>{
					if(a.familyAgg && a.familyAgg !== null){
						if (!map_guest[a.familyAgg]) {
							map_guest[a.familyAgg] = {artists:{}}
						} else {
							//map_guest[a.familyAgg].artists.push(a)
							if(map_guest[a.familyAgg].artists[a.name]){map_guest[a.familyAgg].artists[a.name]++}
							else{map_guest[a.familyAgg].artists[a.name] = 1 }
						}
					}
					//testing: only genres from highlighted family
					if(highlighter.hoverState[0] === a.familyAgg){
						_genres = _genres.concat(a.genres)
					}

				});

			}else if(d.artists) {
				//playlists
				//todo: hard part is representing a playlist proportionately within itself
				//I have the familyAgg for each artist - so just make a ranking of these then using the artistFreq
				var rank = makeRank(d.artists, d.artistFreq, "familyAgg");
				//console.log("rank",rank);

				//testing: non-proportionate ranks
				//with bubble data, the playlist needs to be contained within a single family bubble
				//b/c otherwise it will be represented in more than a single node. with playlist ranking,
				//this means that I have to choose whatever fam represents the genre the most.
				//the values will all be equal for the node sizes b/c nothing else makes sense
				//(I can't really talk about the family content of a playlist I've already decided would be described by it's top rank)

				for (var x = 0; x < rank.length && x < 3; x++) {
					var fam = Object.keys(rank[x])[0];
					//!(map_guest[fam]) ? map_guest[fam] = 1 : map_guest[fam]++
					if (!map_guest[fam]) {
						map_guest[fam] = {playlists:[d.name]}
					} else {
						map_guest[fam].playlists.push(d.name)
						// if(map_guest[fam].playlists[d.name]){map_guest[fam].playlists[d.name]++}
						// else{map_guest[fam].playlists[d.name] = 1 }
					}
				}
			}
			//todo: artists: familyAgg is good enough signifier here?
			else if(d.familyAgg && d.familyAgg !== null){

				//testing:
				//compare map_guests of each person for each family
				//compare the total # of artists for each family for each user:
				//- if both USER and GUEST have a decent number, that's an interesting genre for them to talk about
				//- if neither do - it's not
				//- and then something something math


				if (!map_guest[d.familyAgg]) {
					map_guest[d.familyAgg] = {artists:{}}
				} else {
					//map_guest[d.familyAgg].artists.push(a)
					if(map_guest[d.familyAgg].artists[d.name]){map_guest[d.familyAgg].artists[d.name]++}
					else{map_guest[d.familyAgg].artists[d.name] = 1 }
				}
			}else{
				console.error("malformed data passed to pie");
			}
		})

		console.log("new map",map);
		console.log("new guest map",map_guest);

		//setup base values for bubblechart
		var d = [];
		systemFamilies.forEach(f =>{
			d.push({id:uuid(),name:f,color:familyColors[f + "2"],	type: "packedbubble",data:[]})
		})
		var bubbleData = JSON.parse(JSON.stringify(d));
		var relativeScale = 100;
		var scale = [50,200,350,500]

		switch(statcontrol.stats.name) {
			case "artists_top":
			case "artists_recent":
			case "artists_saved":
			case "tracks_recent":
			case "tracks_saved":

				//set pie data: here you can see the pie chart ignoring the actual occurence value of the artists,
				//and is instead just proportioning slices based on # of artists in the family
				Object.keys(map).forEach(fam =>{tempPieData.push({x:fam,y:Object.keys(map[fam].artists).length})});


				//set bubble data: on the other hand, we need the occurrence values in order to size the inner bubbles
				Object.keys(map).forEach(fam =>{
					var series = _.find(bubbleData, function(o) { return o.name === fam });
					series.data = []
					Object.keys(map[fam].artists).forEach(aname =>{
						series.data.push({name:aname,
							value:scale[map[fam].artists[aname] -1 ],
							color:familyColors[fam]
						})
					})
				});
				break;
			case "playlists":
				//for pie, we can describe a playlist using more than 1 slice
				Object.keys(map).forEach(fam =>{tempPieData.push({x:fam,y:Object.keys(map[fam].playlists).length})});


				Object.keys(map).forEach(fam =>{
					var series = _.find(bubbleData, function(o) { return o.name === fam });
					series.data = []
					map[fam].playlists.forEach(aname =>{
						series.data.push({name:aname,
							//'value of playlist' doens't make sense here
							// value:map[fam].playlists.length * relativeScale,
							value:1 * relativeScale,
							color:familyColors[fam]
						})
					})
				});
				break;
			case "123028477":
			case "friends":

				//create arrays for each map

				var artists_user = [];
				var artists_guest = [];
				Object.keys(map).forEach(fam =>{
					//for each artist key on a fam
					Object.keys(map[fam].artists).forEach(aname =>{
						artists_user.push({name:aname,familyAgg:fam})
					})
				});
				Object.keys(map_guest).forEach(fam =>{
					Object.keys(map_guest[fam].artists).forEach(aname =>{
						artists_guest.push({name:aname,familyAgg:fam})
					})
				});

				var shared = _.intersectionBy(artists_user,artists_guest,'name');
				var dif_user = _.differenceBy(artists_user,shared,'name');
				var dif_guest = _.differenceBy(artists_guest,shared,'name');

				//todo: attempted to demo shared v user/guest w/ value, but I don't fucking understand how this scale works lol
				//todo: create alternate colors for each?
				//todo: if we're going to be able to switch - probably should mark the data w/ it's owner
				//and then the control could then filter in/out on those?

				//todo: anyway to do the custom group highlighting we get for free w/ series?

				//testing: complete wipe = lose cool animation?
				//or is there none anyways
				bubbleData.forEach(series =>{series.data = []})

			function getShared(){
				shared.forEach(tuple =>{
					//find series for tuple
					var series = _.find(bubbleData, function(o) { return o.name === tuple.familyAgg });
					//only during this shared iteration, we'll wipe out old data
					series.data = []
					series.data.push({name:tuple.name, value:scale[0],
						color:familyColors[tuple.familyAgg],owner:"shared",className:"shared"
					})
				});
			}
			function getDifUser(){
				dif_user.forEach(tuple =>{
					//find series for tuple
					var series = _.find(bubbleData, function(o) { return o.name === tuple.familyAgg });
					series.data.push({name:tuple.name, value:scale[0],
						color:familyColors[tuple.familyAgg],owner:"user",className:"difUser"
					})
				});
			}
			function getDifGuest(){
				dif_guest.forEach(tuple =>{
					//find series for tuple
					var series = _.find(bubbleData, function(o) { return o.name === tuple.familyAgg });
					series.data.push({name:tuple.name, value:scale[2],
						color:familyColors[tuple.familyAgg],owner:"guest",className:"difGuest"
					})
				});
			}

				console.log("friendscontrol.compare",friendscontrol.compare);
				switch (friendscontrol.compare) {
					case 'all':
						getShared();getDifUser();getDifGuest();break;
					case 'diff':
						getDifUser();getDifGuest();break;
					case 'shared':
						getShared();break;
					case 'user':
						break;
					case 'guest':
						break;
				}
				break;
			default:
				console.warn("skipped stat re-render for: " + statcontrol.stats.name)
				break;
		}

		_genres = _.uniqBy(_genres,e =>{return e.id})

		bubbleData = bubbleData.filter(r =>{return !(r.data.length === 0)})
		console.log("f",friendscontrol.families);
		bubbleData = bubbleData.filter(r =>{
			if(friendscontrol.families.length !== 0){
				console.log("r",r.name);
				return friendscontrol.families.indexOf(r.name) !== -1
			}
			return true;
		})

		//venn
		var series_sample = [
			{
				type: 'venn',
				name:'Pop',
				data: [{
					sets: ['User'],
					value: 2,

				}, {
					sets: ['Guest'],
					value: 2
				},{
					sets: ['User', 'Guest'],
					value: 1.5,
					name: 'Shared',
					// events: {click: function () {
					// 		console.log("click shared");
					// 		friendscontrol.setCompare('shared')}},
				}]
			}
		]



		setPieData(tempPieData);
		setGenres(_genres)
		setBubbleData(bubbleData);
		setVennData(series_sample);
		//return {bubble:bubbleData,pie:tempPieData,genres:_genres}

	},[statcontrol.stats.name,statcontrol.mode,highlighter.hoverState,friendscontrol.compare,friendscontrol.families, JSON.stringify(globalState.node)]);



	//console.log("returns",{bubble:bubbleData,pie:pieData,genres:genres});
	return {bubbleData:bubbleData,pieData:pieData,genres:genres,vennData:vennData}
}

function familyFreq(a){

	var ret = null;

	//a = JSON.parse(JSON.stringify(a));
	//console.log(JSON.parse(JSON.stringify(a)));
	// console.log("familyFreq",a.genres);
	// console.log("familyFreq",a.genres.length >0);

	if(a.genres && a.genres.length >0){
		var fmap = {};
		for (var z = 0; z < a.genres.length; z++) {
			if (a.genres[z].family_name) {
				if (!(fmap[a.genres[z].family_name])) {
					fmap[a.genres[z].family_name] = 1
				} else {
					fmap[a.genres[z].family_name]++;
				}
			}
		}

		//console.log("$fmap",fmap);

		//check the family map defined and see who has the highest score
		if (!(_.isEmpty(fmap))) {
			//convert map to array (uses entries and ES6 'computed property names')
			//and find the max
			var arr = [];
			Object.entries(fmap).forEach(tup => {
				var r = {[tup[0]]: tup[1]};
				arr.push(r);
			});
			//todo: could offer this
			var m = _.maxBy(arr, function (r) {
				return Object.values(r)[0]
			});
			var f = Object.keys(m)[0];
			//console.log("%", f);
			ret = f ;
		}
	}else{
		//if
		console.warn("no genres!",a.name);
	}
	ret ? a.familyAgg = ret:{};
	return ret;
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

export default {
	familyFreq,makeRank,makeRank2,prepTracks,useProduceData,useCustomHook
}
