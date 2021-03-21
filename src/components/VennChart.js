import React, {} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Venn from 'highcharts/modules/venn';
Venn(Highcharts);
function VennChart(props) {

	const options = {
		chart:{
			margin: [0, 0, 0, 0],
			spacing:[0, 0, 0, 0],
			height:450,
			width:500,
			backgroundColor:"transparent"
		},
		title:{text:"",margin:0},
		credits: {enabled: false},
		series: props.data
	};

	return(<div>
		<div>
			{/*<button onClick={() =>{setLegend(!legend)}}>legend</button>*/}
			<HighchartsReact highcharts={Highcharts} options={options} />
		</div>
	</div>)
}
export default VennChart;
