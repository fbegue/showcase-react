
import React from "react";
import { VictoryChart,VictoryPie } from 'victory';
import _ from "lodash";
import all_genres from "./alasql/all_genres";
import {familyColors,familyGenre_map,genreFam_map} from "./families";
import util from './util/util'
import {Control,Highlighter} from './index'
import ReactWordcloud from 'react-wordcloud';
import CloudIcon from '@material-ui/icons/Cloud';
import PieChartIcon from '@material-ui/icons/PieChart';
import RedoIcon from '@material-ui/icons/Redo';

import Popover from '@material-ui/core/Popover';
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";

//testing: 'useContainer' of undefined b/c control somehow isn't ready?
// function withControl(Component){
// 	let control = Control.useContainer();
// 	return <Component control={control} {...props}/>
// }

var options = {rotations:0,deterministic:true}
var size = [400,400]

function Pie(props) {

	let highlighter = Highlighter.useContainer();
	//https://formidable.com/open-source/victory/guides/animations/

	// constructor(props) {
	// 	super(props);
	// 	console.log("$data",props.data);
	// 	this.state = {
	// 		scatterData: this.getScatterData(),
	// 		sorted:[]
	// 	};
	// }

	// //example of constantly updating state
	// componentDidMount() {
	// 	//var x = true;
	// 	// this.setStateInterval = window.setInterval(() => {
	// 	// 	this.setState({
	// 	// 		scatterData: this.getScatterData(x)
	// 	// 	});
	// 	// }, 3000);
	// }
	//
	// componentWillUnmount() {
	// 	//window.clearInterval(this.setStateInterval);
	// }


	const getScatterData = (x) => {
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
	const sorted = () => {
		//console.log("$",props.data);
		//filter the newly updated value of node
		var pieData = [];
		var pie = {};
		if(props.data.length){

			//note: dealing with both playlists and artists in agg now
			props.data.forEach(a =>{
				//if it was an artist, we just take its family agg
				if(a.familyAgg){
					!(pie[a.familyAgg]) ? pie[a.familyAgg] = 1:pie[a.familyAgg]++
					//for playlists we need to determine what families to put into pie based on playlist content
				}else if(a.artists){

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
					console.error("malformed data passed to pie",props.data);
				}
			})
		}else{
			//pie stays
		}

		//console.log("$pie",pie);
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

	function showGenres(data){
		console.log("showGenres",data);
		var words = [];
		data.forEach(r=>{
			r.genres.forEach(g =>{
				//todo: pruning no-family-genres for now
				//..if there's no family, sort to the bottom
				if(g.family_name !== null){
					words.push({text:g.name,value:1,family_name:g.family_name});
				}
			})
		})
		//console.log("$1",JSON.parse(JSON.stringify(words)));
		words = _.uniq(words);
		words = words.sort((el1,el2) =>{
			//otherwise, order by family membership
			return el1.family_name.localeCompare(el2.family_name)

		})
		console.log("$2",JSON.parse(JSON.stringify(words)));
		const callbacks = {
			getWordColor: word => familyColors[word.family_name],
			// onWordClick: console.log,
			// onWordMouseOver: console.log,
			getWordTooltip: word => null,
		}

		//---------------------
		// const [anchorEl, setAnchorEl] = React.useState(null);
		//
		// const handleClick = (event) => {
		// 	setAnchorEl(event.currentTarget);
		// };
		//
		// const handleClose = () => {
		// 	setAnchorEl(null);
		// };
		//
		// const open = Boolean(anchorEl);
		// const id = open ? 'simple-popover' : undefined;
		//---------------------

		return(
			<ReactWordcloud words={words} options={options}  callbacks={callbacks}/>
			//testing: thought about doing a popover...
			// <div>
			// 	<button aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
			// 		Open Popover
			// 	</button>
			// 	<Popover
			// 		id={id}
			// 		open={open}
			// 		anchorEl={anchorEl}
			// 		onClose={handleClose}
			// 		anchorOrigin={{
			// 			vertical: 'center',
			// 			horizontal: 'left',
			// 		}}
			// 		transformOrigin={{
			// 			vertical: 'top',
			// 			horizontal: 'left',
			// 		}}
			// 	>
			// 		<ReactWordcloud words={words} options={options} callbacks={callbacks}/>
			// 	</Popover>
			// </div>

			//testing: simple map
			// <div>
			// 	{data.map((item,i) => (
			// 		<div>
			// 			{item.genres.map((g,i) => (
			// 				<div>{g.name}</div>
			// 			))}
			// 		</div>
			// 	))}
			// </div>
		)
	}

	const [view, setView] = React.useState(false);

	return (
		// <VictoryChart animate={{ duration: 2000, easing: "bounce" }}>
		// styles: https://formidable.com/open-source/victory/docs/victory-pie/
		// events: https://formidable.com/open-source/victory/guides/events/

		<div>
			<div style={{display:"flex"}}>
				<div style={{flexGrow:"1"}}></div>
				<RedoIcon fontSize={'small'}/>
				<button onClick={() =>{setView(!view)}}>
					{view ? <PieChartIcon fontSize={'small'}/>:<CloudIcon fontSize={'small'}/>}
				</button>
			</div>
			<div style={{width:"15em",height:"16em"}}>
				{/*todo: not sure how to go about making showGenres render in background
				   like make it so it's always re-rendering itself even when not visible*/}
				{view && <div>{showGenres(props.data)}</div>}
				{!(view) &&
				<VictoryPie
					data={sorted()}
					 padAngle={2}
					innerRadius={80}
					animate={{
						duration: 2009, easing: "bounce"
					}}
					style={{
						data: {
							fill: (d) => familyColors[d.slice.data.x]
						}
					}}
					events={[{
						target: "data",
						eventHandlers: {
							onMouseOver: () => {
								return [{
									mutation: (props) => {
										console.log("onMouseOver | control", highlighter.hoverState);
										console.log(props);
										//props.datum is the target releated to the event
										//we happen to be storing the family name as the x value
										//testing: setting single value in an array for now
										//maybe increase # of values allowed eventually for some fancy reason...

										highlighter.setHoverState([props.datum['x']])
										return {
											style: Object.assign({}, props.style, {stroke: "black", strokeWidth: 2})
										};
									}
								}];
							},
							onMouseOut: () => {
								return [{
									mutation: () => {
										console.log("onMouseOut | control", highlighter.hoverState);
										return null;
									}
								}];
							}
						}
					}]}
				/>
				}
			</div>
		</div>
	);
}

export default Pie;
// export default withControl(Pie)
