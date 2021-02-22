import React, {useState, useEffect, useContext, useRef} from 'react';
import {Highlighter, StatControl} from "../index";
import {familyColors} from "../families";
import {VictoryPie} from "victory";
import {Context} from "../alasql/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import { GLOBAL_UI_VAR } from '../alasql/withApolloProvider';
import tables from "../alasql/tables";
import _ from "lodash";
//testing:
// import NodeDisplay from "../NodeDisplay";
import NodeDisplay from "../NodeDisplayVertical";
import util from "../util/util";
import ReactWordcloud from "react-wordcloud";
import RedoIcon from "@material-ui/icons/Redo";
import PieChartIcon from "@material-ui/icons/PieChart";
import CloudIcon from "@material-ui/icons/Cloud";
import Typography from "@material-ui/core/Typography";

function Stats(props) {
	let statcontrol = StatControl.useContainer();
	const [globalState, globalDispatch] = useContext(Context);
	const [families, selectFamilies] = useState([]);
	const [pieData, setPieData] = useState([]);
	const [dataset, setDataset] = useState([]);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	let highlighter = Highlighter.useContainer();

	//const initialRender = useRef(true);
	useEffect(() => {

		//so basically:
		// when you're only selecting data from one tab or switching between tabs, we only look at one node's data at a time
		// when you start combining tabs, the logic switches to accommodate many different item types


		var data = [];
		var tempPieData = [];
		console.log("useEffect",statcontrol.stats.name);
		//console.log("tables",tables);

		//todo: still working out form here
		//to think about: how much duplication is happening between this and the reducer.

	    //filter either implements a custom filter based on a key, or just returns all checked with that filter
		//basically: context still needs to do custom filters, but custom needs to also check for checked.
		var contextFilter = function(key,i){
			if(statcontrol.mode){
				if(key){
					return i.source === key
				}else{return true}

			}else{
				return i.tableData && i.tableData.checked && (key ? i.source === key : true)
			}
		}

		//set data pointer based on current tab
		switch(statcontrol.stats.name) {
			case "artists_saved":
				//data = globalState[globalUI.user.id + "_artists"].filter(i =>{return i.source === 'saved'})
				data = tables["users"][globalUI.user.id]["artists"].filter(contextFilter.bind(null,'saved'))
				break;
			case "playlists":
				//todo: may not have been stated yet
				if (tables["users"][globalUI.user.id]["playlists"]) {
					data = tables["users"][globalUI.user.id]["playlists"].filter(contextFilter.bind(null,null))
				}
				break;
			default:
			// code block
		}

		//a result of the fact that the incoming data is no longer a prop, I need to expose current dataset for showCloud
		setDataset(data);

		//calculate values for pie based on # of occurences of the familyAggs in the selected data
		var map = {}
		data.forEach(d =>{

			//artists,...
			//todo: doesn't quite make sense ...
			// think this was a notee to myself that I was getting some nulls that shouldn't be there?
			if(d.familyAgg && d.familyAgg !== null){
				if(!map[d.familyAgg]){map[d.familyAgg] = 1}
				else{map[d.familyAgg]++}

				//playlists
			}else if(d.artists){

				//todo: hard part is representing a playlist proportionately next to "another node type object"
				//todo: and, proportionately within itself

				//I have the familyAgg for each artist - so just make a ranking of these then?
				//take top 5
				var rank = util.makeRank(d.artists,d.artistFreq,"familyAgg");
				//testing: non-proportionate ranks
				for(var x =0;x < rank.length && x < 3 ; x++){
					var fam = Object.keys(rank[x])[0];
					!(map[fam]) ? map[fam] = 1:map[fam]++
				}

			}else{
				console.error("malformed data passed to pie");
			}
		})
		Object.keys(map).forEach(fam =>{tempPieData.push({x:fam,y:map[fam]})})
		setPieData(tempPieData);

		//todo: needed?
	},[statcontrol.stats.name,statcontrol.mode, JSON.stringify(globalState.node)]);


	//---------------------------------------------------------------------
	var options = {rotations:0,deterministic:true}
	const [view, setView] = React.useState(false);

	//todo: doesnt work for playlists yet

	function showCloud(data){
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

	function ContextStats(props) {
		var items = [];
		switch(statcontrol.stats.name) {
			case 'artists_saved':
				// code block
				break;
			case 'playlists':
				items.push({label:"Created",value:null})
				items.push({label:"Followed",value:null})
				items.push({label:"Recently Modified",value:null})
				items.push({label:"Most Active",value:null})
				items.push({label:"Oldest",value:null})
				break;
			default:
			// code block
		}
		return(<div>
			<div style={{display:"flex"}}>
				{items.map((item,i) => (
					<div style={{display:"flex"}}>
						<Typography variant="subtitle1" component={'div'} gutterBottom>{item.label}</Typography>
						<Typography variant="body1" component={'div'} gutterBottom>{item.value}</Typography>
					</div>
				))}
			</div>
		</div>)
	}
	return(
		<div>
			<div>
				{statcontrol.stats.name}
			</div>

			<div style={{display:"flex"}}>
				<div style={{flexGrow:"1"}}></div>
				<button onClick={() =>{statcontrol.setMode(!statcontrol.mode)}}>{statcontrol.mode ===  true? 'Context':'Custom'}
				</button>
				<RedoIcon fontSize={'small'}/>
				<button onClick={() =>{setView(!view)}}>
					{view ? <PieChartIcon fontSize={'small'}/>:<CloudIcon fontSize={'small'}/>}
				</button>
			</div>
			<div style={{display:"flex"}}>
				<div>
					<div style={{top: "-5em",right:"2em",position: "relative",height: "21em"}}>
						{view && <div>{showCloud(dataset)}</div>}
						{!(view) &&
						//	todo: no idea how this width/height bit works
						//https://formidable.com/open-source/victory/docs/common-props#style
						//https://formidable.com/open-source/victory/docs/common-props#width
						<div style={{width:"23em"}} >
							<VictoryPie
								// width={220}
								// height={220}
								data={pieData}
								padAngle={2}
								innerRadius={80}
								animate={{
									duration: 2009, easing: "linear"
								}}
								style={{
									data: {fill: (d) => familyColors[d.slice.data.x]}
								}}
								events={[{
									target: "data",
									eventHandlers: {
										onClick: () => {
											return [{
												mutation: (props) => {
													console.log("onClick | ", props.datum);
													var ret = null;
													if (families.indexOf(props.datum.x) === -1) {
														selectFamilies([...families, props.datum.x])
														ret = {
															style: Object.assign({}, props.style, {
																stroke: "black",
																strokeWidth: 2
															})
														};
													} else {
														selectFamilies(families.filter(f => {
															return f !== props.datum.x
														}))
														ret = {
															style: Object.assign({}, props.style, {
																stroke: "none",
																strokeWidth: 2
															})
														};
													}
													return ret;
												}
											}];
										},
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

						</div>}
					</div>
					<div><ContextStats></ContextStats></div>
				</div>
				<div style={{right:"5em",position: "relative"}}><NodeDisplay/> </div>
			</div>


		</div>
	)
}
export default Stats;
