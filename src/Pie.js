
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
		console.log("$",this.props.data);
		//filter the newly updated value of node
		var pieData = [];
		var pie = {};
		if(this.props.data.length){

			//note: dealing with both playlists and artists in agg now
			this.props.data.forEach(a =>{
				if(a.familyFreq){
					!(pie[a.familyFreq]) ? pie[a.familyFreq] = 1:pie[a.familyFreq]++
				}else if(a.artists){

					//need to determine what families to put into pie based on playlist content
					//fortunately we already need to do this for the full listing in the table
					//todo: hard part is representing a playlist proportionately next to "another node type object"
					//todo: and, proportionately within itself
					//for example, I just take the to 3 right now - where #1 could = 50 but #2 = 2


					//I have the familyAgg for each artist - so just make a ranking of these then?
					//take top 5
					var rank = util.makeRank(a.artists,a.artistFreq,"familyAgg");
					//console.log("$rank",rank);

					//testing: non-proportionate ranks
					for(var x =0;x < rank.length && x < 3 ; x++){
						var fam = Object.keys(rank[x])[0];
						!(pie[fam]) ? pie[fam] = 1:pie[fam]++
					}

				}else{
					console.error("malformed data passed to pie",this.props.data.length);
				}
			 })
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