import React, {} from 'react';
import { VictoryStack,VictoryArea } from 'victory';
import {families,familyColors} from "../families"

//testing: (Tabify)
//<Home data={state[user.id + "_artists"].filter(i =>{return i.term})} />

function Main(props) {
	console.log("home",props.data);
	//prepare data for genres-over-time based on artists

	//figure out y values (frequency) for families for each term
	var terms = ["short","medium","long"]
	var freqMap = {short:{},medium:{},long:{}}

	var stackMap = {}
	families.forEach(f =>{stackMap[f] = [];})

	terms.forEach(t =>{
		props.data.filter(a =>{return a.term === t})
			.forEach(at =>{
				var map = freqMap[t];

				//todo: shouldn't have nulls here
				if(at.familyAgg !== null){
					if(!map[at.familyAgg]){map[at.familyAgg] = 1}
					else{map[at.familyAgg]++}
				}
			})
	})

	console.log(freqMap);


	//each stack represents a family with an x = one of the terms
	//therefore each stack has 3 members, one for each term
	//key: x = term, y = freq
	//ex: [{x: "short", y: 6,family:"pop"}, {x: "medium", y: 2,family:"pop"}, {x: "long", y: 1,family:"pop"}]

	//iterate over freqMap
	Object.keys(freqMap).forEach(term =>{
		Object.keys(freqMap[term]).forEach(fam =>{
			stackMap[fam].push({x:term,y:freqMap[term][fam],family:fam})
		})
	})

	//remove 0 length family stacks
	Object.keys(stackMap).forEach(fam =>{
		if(stackMap[fam].length === 0){
			console.log("removed family | 0 length",fam);
			delete stackMap[fam];
		}

		//todo: remove not very interesting stacks
		// it's really about the change that occurs...
		// remove stacks where max of 3x freq is less than ___

		//still exists
		if( stackMap[fam]){
			var freqs = [];
			stackMap[fam].forEach( datum =>{
				freqs.push(datum.y)
			});
			if(Math.max(...freqs) <= 2){
				console.log("removed family | max <=2",fam);
				delete stackMap[fam]
			}
		}
	});

	//need to fill in 0 values - figure out what term is present and fill any that aren't
	Object.keys(stackMap).forEach(fam =>{
		if(stackMap[fam].length < 3){
			var has = []
			stackMap[fam].forEach(datum =>{has.push(datum.x)})
			terms.forEach(t =>{
				if(!(has.includes(t))){
					stackMap[fam].push({x:t,y:0,family:fam})
				}
			})
		}
	});

	//debugger;
	console.log(stackMap);
	var stacks = []
	//var stacks = stackMap.map((s,i) =>{return {data:s,}})
	Object.keys(stackMap).forEach(fam =>{
		stacks.push({family:fam,stack:stackMap[fam]})
	})
	console.log(stacks);



	return(
		<div>
			<VictoryStack>
				{/*<VictoryArea*/}
				{/*	labels={({ data, index }) => index === data.length - 2 ? data[index].family : ""}*/}
				{/*	data={[{x: "short", y: 6,family:"pop"}, {x: "medium", y: 2,family:"pop"}, {x: "long", y: 1,family:"pop"}]}*/}
				{/*	style={{*/}
				{/*		data: {*/}
				{/*			fill: "#c43a31", fillOpacity: 0.7,*/}
				{/*		},*/}
				{/*		labels: {*/}
				{/*			fontSize: 15,*/}
				{/*			fill: ({ datum }) => datum.x === 3 ? "#000000" : "#c43a31"*/}
				{/*		}*/}
				{/*	}}*/}
				{/*/>*/}
				{/*<VictoryArea*/}
				{/*	labels={({ data, index }) => index === data.length - 2 ? data[index].family : ""}*/}
				{/*	data={stackMap['rock']}*/}
				{/*/>*/}
				{
					stacks.map((st, key) =>
						<VictoryArea
							key={key}
							labels={({ data, index }) => {
								// console.log("i",index);
								// console.log("data",data.length -1);
								// return index == data.length - 1 ? st.family : ""
								return index == 1 ? st.family : ""
							}}
							data={st.stack}
							style={{
								data: {
									fill: familyColors[st.family +'2'], fillOpacity: 0.7,
								},
								labels: {
									fontSize: 15,
									//fill: ({ datum }) => datum.x === 3 ? "#000000" : "#c43a31"
								}
							}}
						/>
					)
				}

			</VictoryStack>
		</div>)
}
export default Main;
