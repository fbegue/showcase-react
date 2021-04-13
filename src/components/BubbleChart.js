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

	//console.log("BubbleChart",props);
	//const [legend, setLegend] = useState(false);

	//todo:is there a need for legend at all?
	///if you have genres appearing, you just put the family on top
	// can dynamically enable/disable (had issue using as state prop from stats though?)

	//For modifying the chart at runtime: See the class reference.
	//https://api.highcharts.com/class-reference/classes.list


	return(<div>
		<div>
			{/*<button onClick={() =>{setLegend(!legend)}}>legend</button>*/}
			<HighchartsReact highcharts={Highcharts} options={props.options} />
		</div>
	</div>)
}
export default BubbleChart;
