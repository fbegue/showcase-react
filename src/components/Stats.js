import React, {useState, useEffect, useContext, useRef, useMemo} from 'react';
import {FriendsControl, Highlighter, StatControl} from "../index";
import {families, familyColors} from "../families";
import {VictoryPie} from "victory";
import {Context} from "../storage/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import { GLOBAL_UI_VAR } from '../storage/withApolloProvider';
import tables from "../storage/tables";
import _ from "lodash";
import ContextStats from './ContextStats'

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
import GenresDisplayVertical from "./GenresDisplayVertical";
import BubbleChart from "./BubbleChart";
import {families as systemFamilies} from '../families'
import './Stats.css'
import {FormControl, FormControlLabel, Radio, RadioGroup, Select} from "@material-ui/core";
const uuid = require('react-uuid')




function Profile({ name, location }) {
	const [color, setColor] = useState('blue');

	setTimeout(e =>{setColor('pink')},2000)
	useEffect(() => {
		console.log("componentDidMount | profile");
		// Update the document title using the browser API
		//testing:
		// document.title = `You clicked ${count} times`;
		return function cleanup() {
			console.log("componentWillUnmount| profile");
		};
	});

	return (
		<div style={{ backgroundColor: color }}>
			<div>name</div>
			<div>location</div>
		</div>
	)
}

const personsAreEqual = (prevProps, nextProps) => {return true}
const MemoizedProfile = React.memo(Profile,personsAreEqual)

function useTraceUpdate(props) {
	const prev = useRef(props);
	useEffect(() => {
		const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
			if (prev.current[k] !== v) {
				ps[k] = [prev.current[k], v];
			}
			return ps;
		}, {});
		if (Object.keys(changedProps).length > 0) {
			console.log('Changed props:', changedProps);
		}else{
			console.log('no changed props!');
		}
		prev.current = props;
	});
}

function Stats(props) {
	// useTraceUpdate(props);
	let statcontrol = StatControl.useContainer();
	const [globalState, globalDispatch] = useContext(Context);
	const [families, selectFamilies] = useState([]);
	// const [pieData, setPieData] = useState([]);
	// const [genres, setGenres] = useState([]);
	// const [bubbleData, setBubbleData] = useState([]);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	let highlighter = Highlighter.useContainer();
	let friendscontrol = FriendsControl.useContainer()

	var doc = document.documentElement.style;
	doc.setProperty(`--pointHighlightGuest`,'red');
	doc.setProperty(`--pointHighlightUser`,'blue');
	doc.setProperty(`--pointHighlightShared`,'green');
	//  function highlightGroup(){
	// 	console.log("highlightGroup");
	// 	if(c % 2 === 0){
	// 		doc.setProperty(`--${"color-nav"}`,"#807878");
	// 		doc.setProperty(`--${"color-nav-hover"}`,"#dccfcf");
	// 		c++;
	// 	}else{
	// 		doc.setProperty(`--${"color-nav"}`,"darkred");
	// 		doc.setProperty(`--${"color-nav-hover"}`,"red");
	// 		c++;
	// 	}
	// }

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
	// useEffect(() => {
	//
	// 	// const {bubble,pie,genres} = util.useProduceData()
	// 	const {test} = util.useCustomHook()
	// 	// console.log("new bubbleData",bubble);
	// 	// setBubbleData(bubbleData);
	// 	// console.log("new PieData",pie);
	// 	// setPieData(pie);
	// 	//
	// 	// console.log("new genres",genres);
	// 	// setGenres(genres)
	//
	// },[statcontrol.stats.name,statcontrol.mode,highlighter.hoverState, JSON.stringify(globalState.node)]);

	 const {bubbleData,pieData,genres} = util.useProduceData()
	//const bubbleData = [];const pieData = [];const genres = []

	// console.log("useProduceData:pieData",pieData);
	//---------------------------------------------------------------------
	var options = {rotations:0,deterministic:true}
	//false = pie, true = bubble
	const [view, setView] = React.useState(true);

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

	let bubbleOptions = {
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
			enabled:false
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
		// series:props.data,
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
	let bubbleOptionsGuest = {
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
			enabled:false
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
		// series:props.data,
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

	function checkState(){
		console.log("$globalstate",globalState);
		console.log("$globalUI",globalUI);
	}
	const handleChange = (event) => {
		friendscontrol.setCompare(event.target.value);
	};

	const handleChangeMultiple = (event) => {
		const { options } = event.target;
		const value = [];
		for (let i = 0, l = options.length; i < l; i += 1) {
			if (options[i].selected) {
				value.push(options[i].value);
			}
		}
		friendscontrol.setFamilies(value);
	};

	return(
		<div>
			<div>
				{statcontrol.stats.name}
			</div>

			<div style={{display:"flex"}}>
				{/*<div style={{flexGrow:"1"}}></div>*/}
				<div style={{display:"flex"}}>
					<div>

						<Select
							multiple
							native
							value={friendscontrol.families}
							onChange={handleChangeMultiple}
							inputProps={{
								id: 'select-multiple-native',
							}}
						>
							{systemFamilies.map((name) => (
								<option key={name} value={name}>{name}</option>
							))}
						</Select>
					</div>
					<div>
						{/*todo: need to make container smaller, not do relative pos
					 style={{top: "-5em",right:"2em",position: "relative",height: "21em"}}*/}

						{/*{statcontrol.stats.name !== '123028477' &&*/}
						<div  style={{top: "-4em",position: "relative",height: "21em",zIndex:1}}>
							{/*{view && <div>{showCloud(dataset)}</div>}*/}
							{/*options={{legend:legend}}*/}
							{view &&
							<div>
								{/* testing: */}
								{statcontrol.stats.name === '123028477' &&
								<BubbleChart  options={{...bubbleOptionsGuest,series:bubbleData}}/>
								}
								{statcontrol.stats.name !== '123028477' &&
								<BubbleChart  options={{...bubbleOptions,series:bubbleData}}/>
								}
							</div>
							}
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
						<div><ContextStats /></div>
					</div>
					{/*testing: disable node display, genres*/}
					{/*<div style={{right:"5em",position: "relative"}}><NodeDisplay/> </div>*/}
					{/*<div style={{right:"5em",position: "relative"}}><GenresDisplayVertical genres={genres}/> </div>*/}
				</div>
				<div style={{zIndex:2}}>
					<button  onClick={() =>{statcontrol.setMode(!statcontrol.mode)}}>{statcontrol.mode ===  true? 'Context':'Custom'}
					</button>
					<button onClick={checkState}>checkState</button>
					<button  onClick={() =>{friendscontrol.setCompare(!friendscontrol.compare)}}>{friendscontrol.compare ===  true? 'Both':'Difference'}
					</button>
					<RedoIcon fontSize={'small'}/>
					<button onClick={() =>{setView(!view)}}>
						{view ? <PieChartIcon fontSize={'small'}/>:<CloudIcon fontSize={'small'}/>}
					</button>
					<div style={{display:"flex"}}>
						{/*<VennChart data={vennData}/>*/}
						<div>
							<FormControl component="fieldset">
								{/*<FormLabel component="legend">Gender</FormLabel>*/}
								<RadioGroup  name="radio1" value={friendscontrol.compare} onChange={handleChange}>
									<FormControlLabel value="all" control={<Radio />} label="All" />
									<FormControlLabel value="shared" control={<Radio />} label="Shared" />
									<FormControlLabel value="user" control={<Radio />} label="User" />
									<FormControlLabel value="guest" control={<Radio />} label="Guest" />
								</RadioGroup>
							</FormControl>
						</div>

					</div>

				</div>

			</div>



		</div>
	)
}
export default Stats;
