import React, {useState, useEffect, useContext, useRef, useMemo} from 'react';
import {Highlighter, StatControl} from "../index";
import {familyColors} from "../families";
import {VictoryPie} from "victory";
import {Context} from "../storage/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import { GLOBAL_UI_VAR } from '../storage/withApolloProvider';
import tables from "../storage/tables";
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
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import useMedia from "./Masonry/useMedia";
import {a, useTransition} from "react-spring";
import {Tab} from "react-tabify";

function Stats(props) {
	let statcontrol = StatControl.useContainer();
	const [globalState, globalDispatch] = useContext(Context);
	const [families, selectFamilies] = useState([]);
	const [pieData, setPieData] = useState([]);
	const [dataset, setDataset] = useState([]);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	let highlighter = Highlighter.useContainer();

	// useEffect(() => {
	// 	console.log("componentDidMount | stats");
	// 	// Update the document title using the browser API
	// 	//testing:
	// 	// document.title = `You clicked ${count} times`;
	// 	return function cleanup() {
	// 		console.log("componentWillUnmount| stats");
	// 	};
	// });

	//const initialRender = useRef(true);
	useEffect(() => {

		//so basically:
		// when you're only selecting data from one tab or switching between tabs, we only look at one node's data at a time
		// when you start combining tabs, the logic switches to accommodate many different item types


		var data = [];
		var tempPieData = [];
		console.log("useEffect",statcontrol.stats.name);
		//console.log("tables",tables);

		//todo: tried to avoid having to do double work here and reducer
		//but the tab that I'm passing around still needed to be reduced here...
	    //filter either implements a custom filter based on a key, or it's playlists?
		var contextFilter = function(key,rec) {
			var t = false;

			if (key === 'top') {
				t = rec['term'] !== null
			} else {
				t = rec['source'] === key
			}

			if (statcontrol.mode) {
				if (key) {return t}
				else {return true}
			}
		}

		//set data pointer based on current tab
		switch(statcontrol.stats.name) {
			case "artists_saved":
				//data = globalState[globalUI.user.id + "_artists"].filter(i =>{return i.source === 'saved'})
				//data = tables["users"][globalUI.user.id]["artists"].filter(contextFilter.bind(null,'saved'))
				data = globalState[globalUI.user.id + "_artists"].filter(contextFilter.bind(null,'saved'))
				break;
			case "artists_top":
				data = globalState[globalUI.user.id + "_artists"].filter(contextFilter.bind(null,'top'))
				break;
			case "artists_recent":
				data = globalState[globalUI.user.id + "_artists"].filter(contextFilter.bind(null,'recent'))
				break;
			case "playlists":
				//todo: may not have been stated yet
				if (tables["users"][globalUI.user.id]["playlists"]) {
					data = tables["users"][globalUI.user.id]["playlists"].filter(contextFilter.bind(null,null))
				}
				break;
			case "tracks_recent":
				data = globalState[globalUI.user.id + "_tracks"].filter(contextFilter.bind(null,'recent'))
				break;
			case "tracks_saved":
				data = globalState[globalUI.user.id + "_tracks"].filter(contextFilter.bind(null,'saved'))
				break;
			default:
				console.warn("skipped stat re-render for: " + statcontrol.stats.name)
				break;
		}

		console.log("new data",data);


		//a result of the fact that the incoming data is no longer a prop, I need to expose current dataset for showCloud
		setDataset(data);

		//calculate values for pie based on # of occurences of the familyAggs in the selected data
		var map = {}
		data.forEach(d =>{

			//todo: this is many artists from many tracks
			//the abstraction is always going to not-perfectly represent the tracks themselves
			if(d.type === 'track'){
				d.artists.forEach(a =>{
					if(!map[a.familyAgg]){map[a.familyAgg] = 1}
					else{map[a.familyAgg]++}
				});

			}else if(d.artists) {
				//playlists
				//todo: hard part is representing a playlist proportionately next to "another node type object"
				//todo: and, proportionately within itself

				//I have the familyAgg for each artist - so just make a ranking of these then?
				//take top 5
				var rank = util.makeRank(d.artists, d.artistFreq, "familyAgg");
				//testing: non-proportionate ranks
				for (var x = 0; x < rank.length && x < 3; x++) {
					var fam = Object.keys(rank[x])[0];
					!(map[fam]) ? map[fam] = 1 : map[fam]++
				}
			}
			//todo: artists? familyAgg is good enough signifier here?
			//todo: null thing doesn't quite make sense ...
			// think this was a notee to myself that I was getting some nulls that shouldn't be there?
			else if(d.familyAgg && d.familyAgg !== null){
				if(!map[d.familyAgg]){map[d.familyAgg] = 1}
				else{map[d.familyAgg]++}
			}else{
				console.error("malformed data passed to pie");
			}
		})

		console.log("new map",map);
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

	//todo: trying to figure out memo'ing for contextstats
	//but shit doesn't work - not sure what the difference here is
	//https://kyleshevlin.com/using-react-memo-to-avoid-unnecessary-rerenders

	// function Profile({ name, location }) {
	// 	const [color, setColor] = useState('blue');
	//
	// 	setTimeout(e =>{setColor('pink')},2000)
	// 	useEffect(() => {
	// 		console.log("componentDidMount | profile");
	// 		// Update the document title using the browser API
	// 		//testing:
	// 		// document.title = `You clicked ${count} times`;
	// 		return function cleanup() {
	// 			console.log("componentWillUnmount| profile");
	// 		};
	// 	});
	//
	// 	return (
	// 		<div style={{ backgroundColor: color }}>
	// 			<div>name</div>
	// 			<div>location</div>
	// 		</div>
	// 	)
	// }
	//
	// const personsAreEqual = (prevProps, nextProps) => {return true}
	// const MemoizedProfile = React.memo(Profile,personsAreEqual)

	function ContextStats(props) {

		//todo: thought storing in proper state would smooth transition
		//I'm not even sure if I get what I'm looking for for free really...
		var _items = [];
		//const [items, setItems] = useState([]);

		function ListArtists(props){
			return (
				<div>
					{props.artists.map((item,i) => (
						<div>{item.artist.name}</div>
					))}
				</div>
			)
		}

		function ListTracks(props){
			return (
				<div>
					{props.tracks.map((item,i) => (
						<div>{item.name}</div>
					))}
				</div>
			)
		}

		switch(statcontrol.stats.name) {
			case 'artists_saved':
				_items.push({label:"test1",value:null})
				_items.push({label:"test2",value:null})
				_items.push({label:"test23",value:null})
				break;
			case 'playlists':
				var source = globalState[globalUI.user.id + "_playlists_stats"];
				_items.push({label:"Created",value:source.created,width:"120px"})
				_items.push({label:"Followed",value:source.followed,width:"120px"})
				_items.push({label:"Collaborating",value:source.collaborative,width:"120px"})
				_items.push({label:"Recently Modified",value:source.recent.playlist_name,width:"240px"})
				// items.push({label:"Most Active",value:null})
				_items.push({label:"Oldest",value:source.oldest.playlist_name,width:"240px"})
				break;
			case 'tracks_saved':
				var source = globalState[globalUI.user.id + "_tracks_stats"];
				_items.push({label:"Favorite Artists",value:<ListArtists artists={source.artists_top}/>,width:"240px"})
				_items.push({label:"Recently Saved",value:<ListTracks tracks={source.recent}/>,width:"240px"})
				break;
			default:
			// code block
		}
		//_items.length !== 0 && items.length === 0 ? setItems(_items):{};
		var items = _items;

		//-----------------------------------------------
		//todo: this is cool, but not sure what it means for me in this context
		//const columns = useMedia(['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'], [5, 4, 3], 2)
		const columns = 3;

		// Hook2: Measure the width of the container element
		//todo: disabled this b/c of 'illegal invocation' when moving off this component
		//related to bind - possibly b/c I'm destroying the element below that I would be binding to
		//...and then like it realizes that it's invalid and complains? idk
		//const [bind, { width }] = useMeasure()
		//console.log("bind",bind);
		//console.log("width",width);
		const width = 480;

		//note: replaced all references to data-height (designed to be unique values 300-500) with uHeight
		const uHeight = 100;

		//note: attempted to make this into a variable width depending on the data element, but that doesn't make sense
		//without a serious rework, there will never be a variable # of COLUMNS

		const [heights, gridItems] = useMemo(() => {
			let heights = new Array(columns).fill(0) // Each column gets a height starting with zero
			let gridItems = items
				.map((child, i) => {
					const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
					const xy = [(width / columns) * column, (heights[column] += uHeight / 2) - uHeight / 2] // X = container width / number of columns * column index, Y = it's just the height of the current column
					return { ...child, xy, width: width / columns, height: uHeight / 2 }
				})
			return [heights, gridItems]
		}, [columns, items])

		// Hook6: Turn the static grid values into animated transitions, any addition, removal or change will be animated
		const transitions = useTransition(
			gridItems,
			(item) => item.label, {
				from: ({ xy, width, height }) => ({ xy, width, height, opacity: 0 }),
				enter: ({ xy, width, height }) => ({ xy, width, height, opacity: 1 }),
				update: ({ xy, width, height }) => ({ xy, width, height }),
				leave: { height: 0, opacity: 0 },
				config: { mass: 5, tension: 500, friction: 100 },
				trail: 25
			})
		//-----------------------------------------------

		return(
			<div>
			{/*	note: attempt at transitions*/}
			{/*<div  className="list" style={{height: Math.max(...heights)}}>*/}
			{/*	{transitions.map(({item, props: {xy, ...rest}, key}) => (*/}
			{/*		<a.div key={key}*/}
			{/*			   style={{transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`), ...rest}}>*/}
			{/*			<div style={{display:"flex"}}>*/}
			{/*				<Typography variant="subtitle1" component={'div'} >{item.label}</Typography>*/}
			{/*				<Typography variant="subtitle1" component={'div'} ><span style={{color:'#3f51b5'}}>{item.value}</span></Typography>*/}
			{/*			</div>*/}
			{/*		</a.div>*/}
			{/*	))}*/}
			{/*</div>*/}
			<div style={{display:"flex", flexWrap:"wrap",width:"480px"}}>
				{items.map((item,i) => (
					<div style={{width:item.width, padding:"5px"}}>
						<Card>
							<CardContent>
								<Typography variant="subtitle1" component={'span'} >{item.label}:{'\u00A0'}</Typography>
								{/*todo: color should be typo color prop set in MUI theme*/}
								<Typography variant="subtitle1" component={'span'} ><span style={{color:'#3f51b5'}}>{item.value}</span></Typography>
							</CardContent>
						</Card>

					</div>
				))}
			</div>
		</div>)
	}


	function checkState(){
		console.log("$globalstate",globalState);
		console.log("$globalUI",globalUI);
	}
	return(
		<div>
			<div>
				{statcontrol.stats.name}
			</div>

			<div style={{display:"flex"}}>
				<div style={{flexGrow:"1"}}></div>
				<div style={{zIndex:2}}>
					<button  onClick={() =>{statcontrol.setMode(!statcontrol.mode)}}>{statcontrol.mode ===  true? 'Context':'Custom'}
					</button>
					<button onClick={checkState}>checkState</button>
				</div>
				<RedoIcon fontSize={'small'}/>
				<button onClick={() =>{setView(!view)}}>
					{view ? <PieChartIcon fontSize={'small'}/>:<CloudIcon fontSize={'small'}/>}
				</button>
			</div>
			<div style={{display:"flex"}}>
				<div>
					{/*todo: need to make container smaller, not do relative pos
					 style={{top: "-5em",right:"2em",position: "relative",height: "21em"}}*/}
					<div  style={{top: "-4em",position: "relative",height: "21em",zIndex:1}}>
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
					{/*<div><ContextStats></ContextStats></div>*/}
					<div><ContextStats/></div>
				</div>
				<div style={{right:"5em",position: "relative"}}><NodeDisplay/> </div>
			</div>


		</div>
	)
}
export default Stats;
