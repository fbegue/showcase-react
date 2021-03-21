import React, {useContext, useEffect, useState} from 'react';
import {families, familyColors} from "../families";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more'
import {Context} from "../storage/Store";
import _ from "lodash";
const uuid = require('react-uuid')

HC_more(Highcharts)

function BubbleChart(props) {

	console.log("BubbleChart",props);
	const [legend, setLegend] = useState(false);


	//todo:is there a need for legend at all?
	///if you have genres appearing, you just put the family on top
	// can dynamically enable/disable (had issue using as state prop from stats though?)

	//For modifying the chart at runtime: See the class reference.
	//https://api.highcharts.com/class-reference/classes.list

	const options = {
		tooltip: {
			useHTML: true,
			pointFormat: '<b>{point.name}:</b> {point.value}'
		},
		legend:{
			//layout (horizonal, vert, proximate)
			//itemHoverStyle
			//symbols
			//use HTML
			floating:true,
			enabled:legend
		},
		plotOptions: {
			packedbubble: {
				minSize: "20%",
				maxSize: "100%",
				zMin: 0,
				zMax: 100,
				layoutAlgorithm: {
					gravitationalConstant: 0.05,
					splitSeries: true,
					seriesInteraction: false,
					dragBetweenSeries: true,
					parentNodeLimit: true
				},
				dataLabels: {
					enabled: true,
					format: "{point.name}",
					filter: {
						property: "y",
						operator: ">",
						value: 250
					},
					style: {
						color: "black",
						textOutline: "none",
						fontWeight: "normal"
					}
				}
			}
		},
		series:props.data,
		credits: {
			enabled: false
		},
		// series: [
		// 	{
		// 		type: "packedbubble",
		// 		data: [{name:"1",value:1},{name:"2",value:2}]
		// 	},
		// 	{
		// 		type: "packedbubble",
		// 		color:"blue",
		// 		data: [{name:"1",value:1,color:"lightblue"},{name:"2",value:2}]
		// 	}
		// ]
	};

	return(<div>
		<div>
			{/*<button onClick={() =>{setLegend(!legend)}}>legend</button>*/}
			<HighchartsReact highcharts={Highcharts} options={options} />
		</div>
	</div>)
}
export default BubbleChart;
