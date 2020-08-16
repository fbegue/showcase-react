
import React from "react";
import { VictoryChart,VictoryPie } from 'victory';
import all_genres from "./alasql/all_genres";
import {familyColors,familyGenre_map,genreFam_map} from "./families";



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
			this.props.data.forEach(a =>{
				var ret = false;
				for(var z = 0; z< 	a.genres.length;z++){
					var g = a.genres[z];
					if(familyGenre_map[g.name]){
						ret = g.name;
						break;
					}
					//todo: check comp
				}
				if(ret){
					!(pie[ret]) ? pie[ret] = 1:pie[ret]++
				}
			});
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