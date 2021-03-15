import _ from "lodash";
import ChipsArray from "../ChipsArray";
import React from "react";


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
	familyFreq,makeRank,makeRank2,prepTracks
}
