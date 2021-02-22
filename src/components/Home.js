import React, {useState,useEffect,useMemo} from 'react';
import {familyColors,familyGenre_map,genreFam_map} from "../families";
import DiscreteSlider from "../Slider";
import useMedia from './Masonry/useMedia'
//import useMeasure from './Masonry/useMeasure'
import data from './Masonry/data'
import './Masonry/styles.css'
import { DateTime } from "luxon";

import {Tab} from "react-tabify";
import RedoIcon from "@material-ui/icons/Redo";
import PieChartIcon from "@material-ui/icons/PieChart";
import CloudIcon from "@material-ui/icons/Cloud";
import {VictoryPie} from "victory";
import util from "../util/util";
import List from "@material-ui/core/List";
import {a, useTransition} from "react-spring";
import api from "../api/api";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import {Control} from "../index";
import Typography from "@material-ui/core/Typography";


function Main(props) {
	const [term, setTerm] = useState(null);
	const [pieData, setPieData] = useState([]);
	const [families, selectFamilies] = useState([]);
	const [savedLast, setSavedLast] = useState([]);
	const [hoverStyle, setHoverStyle] = useState(null);

	let control = Control.useContainer();

	useEffect(() => {
		//console.log("componentDidMount");
		var data = [];
		var map = {}
		props.data.filter(i =>{return i.term === term})
			.forEach(at =>{
				//todo: shouldn't have nulls here
				if(at.familyAgg !== null){
					if(!map[at.familyAgg]){map[at.familyAgg] = 1}
					else{map[at.familyAgg]++}
				}
			})
		Object.keys(map).forEach(fam =>{data.push({x:fam,y:map[fam]})})
		//console.log("sorted",data);
		setPieData(data)
	},[term]);


	useEffect(() => {
		api.getMySavedTracksLast()
			.then(r =>{
				console.log("getMySavedTracksLast",r);
				var prep = {}
				r.forEach(tob =>{
					prep[tob.track.id] = null
				})
				setHoverStyle(prep)
				setSavedLast(r);
			})
		return function cleanup() {
			console.log("componentWillUnmount");
		};
	},[]);

	const handleHover = tid => {
		var temp = JSON.parse(JSON.stringify(hoverStyle))
		Object.keys(temp).forEach(k =>{temp[k] = null})

		if(tid !== 'cancel'){
			temp[tid] = {paddingRight:"1em",opacity:".5"};
		}
		setHoverStyle(temp)
	}

	const handleSliderChange = term => {
		console.log("handleSliderChange",term);
		setTerm(term)
		//selectFamilies([])
	}
	//-------------------------------------------

	//note: as soon as data is loaded, setTerm. this will trigger useEffect above to setPieData

	props.data.length > 0 && !(term) ? setTerm('short'):{};



	const columns = useMedia(['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'], [5, 4, 3], 2)

	// Hook2: Measure the width of the container element
	//todo: disabled this b/c of 'illegal invocation' when moving off this component
	//related to bind - possibly b/c I'm destroying the element below that I would be binding to
	//...and then like it realizes that it's invalid and complains? idk
	//const [bind, { width }] = useMeasure()
	//console.log("bind",bind);
	//console.log("width",width);
	const width = 480;

	//note: replaced all references to data-height (designed to be unique values 300-500) with uHeight
	const uHeight = 305;

	const [heights, gridItems] = useMemo(() => {
		let heights = new Array(columns).fill(0) // Each column gets a height starting with zero
		let gridItems = props.data
			.filter(i =>{return i.term === term})
			.filter(i =>{return families.length === 0 ? true: families.indexOf(i.familyAgg) !== -1})
				.map((child, i) => {
			const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
			const xy = [(width / columns) * column, (heights[column] += uHeight / 2) - uHeight / 2] // X = container width / number of columns * column index, Y = it's just the height of the current column
			return { ...child, xy, width: width / columns, height: uHeight / 2 }
		})
		return [heights, gridItems]
	}, [columns, props.data.filter(i =>{return i.term === term}), width])

	// Hook6: Turn the static grid values into animated transitions, any addition, removal or change will be animated
	const transitions = useTransition(
		gridItems,
		(item) => item.id, {
		from: ({ xy, width, height }) => ({ xy, width, height, opacity: 0 }),
		enter: ({ xy, width, height }) => ({ xy, width, height, opacity: 1 }),
		update: ({ xy, width, height }) => ({ xy, width, height }),
		leave: { height: 0, opacity: 0 },
		config: { mass: 5, tension: 500, friction: 100 },
		trail: 25
	})
	//-------------------------------------------

	const styleAddedAt = add_at => {
		//console.log("styleAddedAt",add_at);
		var at = DateTime.fromISO(add_at).toISODate();
		var today = DateTime.fromISO(new Date().toISOString()).toISODate();
		var yesterday = DateTime.fromISO(new Date().toISOString()).plus({days: -1}).toISODate();
		if(at ===today ){
			return "Today, " + DateTime.fromISO(add_at).toLocaleString(DateTime.TIME_SIMPLE);
		}
		else if(at === yesterday){
			return "Yesterday, " + DateTime.fromISO(add_at).toLocaleString(DateTime.TIME_SIMPLE);
		}else{
			return DateTime.fromISO(add_at).get('month') + "/" + DateTime.fromISO(add_at).get('day')
		}
	}

	function handlePlay(item) {
		console.log("$handlePlay",item);
		control.setId(item.id);
		control.togglePlay(!control.play);
	}
	return(
		<div>
			<div style={{display:"flex"}}>
				{/*<div style={{flexGrow:"1"}}></div>*/}
				{/*<DiscreteSlider handleChange={(v) =>{setTerm(v)}}/>*/}
				<div>
					<div>
						<Typography
							component={'span'}
							variant="body1"
							color="textPrimary"
						>
							Recently Saved Songs
						</Typography>
						 {savedLast.length !== 0 && savedLast.map((item,i) => (
							<div key={item.track.id} style={{display:"flex"}}>
								<div style={hoverStyle[item.track.id] === null ?  {paddingRight:"1em"}: hoverStyle[item.track.id]}
									 onMouseEnter={() => handleHover(item.track.id)}
									 onMouseLeave={() => handleHover('cancel')}
								>
									{ hoverStyle[item.track.id] !== null &&
										  <div style={{position:"absolute"}}>
											<div style={{margin:"50%"}}><PlayCircleOutlineIcon  fontSize={'large'} onClick={() =>handlePlay(item.track)}> </PlayCircleOutlineIcon> </div>
										</div>
									}
									<img height={70} src={item.track.album.images[0].url}
									/>
								</div>
								<div>
									<div>{item.track.name}</div>
									<div style={{fontSize:".9em",color:"#a4a4a4"}}>
										by {item.track.artists.map((artist,i) => (
										<span  key={artist.id}>
													<span>{artist.name}</span>
											{item.track.artists.length - 1 > i && <span>,{'\u00A0'}</span>}
												</span>
									))}
									</div>
									<div>{styleAddedAt(item.added_at)}</div>
								</div>
							</div>
						))}
					</div>
					<DiscreteSlider defaultValue={2}  handleChange={handleSliderChange}/>
				</div>
				<div>
					<div  className="list" style={{height: Math.max(...heights)}}>
						{transitions.map(({item, props: {xy, ...rest}, key}) => (
							<a.div key={key}
								   style={{transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`), ...rest}}>
								{/*<div style={{backgroundImage: item.css}} />*/}
								{/*todo: sometimes [0] might not be the one I'm looking for?*/}

								<div>
									<img height={100} src={item.images[0].url}/>
									<div style={{padding:"2px",background:"black",color:"white",height:"20px"}}>{item.name}</div>
								</div>

								{/*<div>{item.images[0].url}</div>*/}
							</a.div>
						))}
					</div>
				</div>
			</div>
		</div>)
}
export default Main;
