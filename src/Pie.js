
import React from "react";
import { VictoryChart,VictoryPie } from 'victory';
import _ from "lodash";
import all_genres from "./alasql/all_genres";
import {familyColors,familyGenre_map,genreFam_map} from "./families";
import util from './util/util'



export default class Pie extends React.Component {

	//https://formidable.com/open-source/victory/guides/animations/

	constructor(props) {
		super(props);
		console.log("$data",props.data);
		this.state = {
			scatterData: this.getScatterData(),
			sorted:[]
		};
	}

	//example of constantly updating state
	componentDidMount() {
		//var x = true;
		// this.setStateInterval = window.setInterval(() => {
		// 	this.setState({
		// 		scatterData: this.getScatterData(x)
		// 	});
		// }, 3000);
	}

	componentWillUnmount() {
		//window.clearInterval(this.setStateInterval);
	}


	getScatterData(x) {
		if(x){
			x = false;
			return [
				{ x: "Cats", y: 39 },
				{ x: "Dogs", y: 43 },
				{ x: "Birds", y: 43}
			]
		}else{
			x = true;
			return [
				{ x: "Cats", y: 19 },
				{ x: "Dogs", y: 3 },
				{ x: "Birds", y: 4}
			]
		}

	}

	//anytime the incoming props.data changes, I need to resort the data
	sorted(){
		//todo: this data.data is a result of passing agg here without
		console.log("$",this.props.data);
		//filter the newly updated value of node
		var pieData = [];
		var pie = {};
		if(this.props.data.length){
			var f = util.familyFreq(this.props.data);
			console.log("$f",f);
			if(f){
				!(pie[f]) ? pie[f] = 1:pie[f]++
			}

			// this.props.data.forEach(a =>{
			// 	//take every artist and look at all their genres to figure out which family best represents them
			// 	//todo: how to do tie-breakers / how to value thresholds
			//
			// 	//todo: particularly, need to make sure that just b/c a band has a more genres defined
			// 	//that doesn't mean that it is more influential - which will be a problem for bands
			// 	//that have more than one major family name
			//
			// 	var fmap = {};
			// 	for(var z = 0; z< a.genres.length;z++){
			// 		if(a.genres[z].family_name){
			// 			if(!(fmap[a.genres[z].family_name])){
			// 				fmap[a.genres[z].family_name] = 1
			// 			}else{
			// 				fmap[a.genres[z].family_name]++;
			// 			}
			// 		}
			// 	}
			// 	//check the family map defined and see who has the highest score
			// 	if(!(_.isEmpty(fmap))){
			// 		//convert map to array (uses entries and ES6 'computed property names')
			// 		//and find the max
			// 		var arr = [];
			// 		Object.entries(fmap).forEach(tup =>{var r = {[tup[0]]:tup[1]};arr.push(r);});
			// 		var m = _.maxBy(arr,function(r){return Object.values(r)[0]});
			// 		var f = Object.keys(m)[0];
			// 		console.log("%",f);
			// 		!(pie[f]) ? pie[f] = 1:pie[f]++
			// 	}
			// });
		}else{
			//pie stays
		}

		console.log("$pie",pie);
		Object.keys(pie).forEach(k =>{
			pieData.push({x:k,y:pie[k]})
		})
		return pieData;
		// return [
		// 	{ x: "Rock", y: 39 },
		// 	{ x: "Rap", y: 43 },
		// 	{ x: "Country", y: 43}
		// ]
	};

	render() {

		return (
			// <VictoryChart animate={{ duration: 2000, easing: "bounce" }}>
			<VictoryPie
				data={this.sorted()}
				animate={{
					duration: 2009, easing: "bounce"
				}}
				style={{
					data: {
						fill: (d) => familyColors[d.slice.data.x]
					}
				}}
			/>
			// </VictoryChart>
		);
	}
}