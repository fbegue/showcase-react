import {StatControl} from "../index";
import React, {useContext, useMemo,useEffect,useState} from "react";
import {Context} from "../storage/Store";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR} from "../storage/withApolloProvider";
import useMedia from "./Masonry/useMedia";
import {a, useTransition} from "react-spring";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import classnames from 'classnames';
import { useContainerQuery, ContainerQuery } from 'react-container-query';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
var statcontrol_prev = null;


function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function ContextStats(props) {

	let statcontrol = StatControl.useContainer();
	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);

	//todo: thought storing in proper state would smooth transition
	//I'm not even sure if I get what I'm looking for for free really...
	// var _items = [];
	// var _tiles = [];
	const [items, setItems] = useState([]);
	const [tiles, setTiles] = useState([]);

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

	function ListGenres(props){
		return (
			<div>
				{props.genres.map((item,i) => (
					<div>{item.name}</div>
				))}
			</div>
		)
	}

	//-----------------------------------------------
	//note: just based on index values (no named map)
	const [selectedTabIndex, setTabIndex] = React.useState(1);
	const handleChange = (event, newValue) => {
		console.log("handleChange",newValue);
		setTabIndex(newValue);
	};

	const [filter, setFilter] = React.useState(null);
	//-----------------------------------------------

	useEffect(() => {
		console.log("componentDidMount");
		var _items = [];
		var _tiles = [];

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
			case 'home':
			case 'Home':
			case 'user1':
			case 'friends':
				console.log('stats: ignoring ' + statcontrol.stats.name);
				break;
			default:
				console.log('default',statcontrol.stats);
				//todo: logic that feels like it belong in my util.js?
				//testing: this is where my 'compare user by this context or that' comes into play

				var user = globalState[globalUI.user.id + "_artists"];
				var guest = globalState[statcontrol.stats.user.id + "_artists"] || [];
				console.log(user);
				console.log(guest);

				switch(selectedTabIndex) {
					case 1:
						//artists
						user.forEach(a =>{
							guest.forEach(ag =>{
								if(a.id === ag.id){
									// _common.push(a)
									ag.common = true;
								}
							})
						})

						break;
					default:
					// code block
				}

				// var _common = guest.filter(r =>{return r.common})
				// const common = _common.map((item) =>
				// 	<li key={item.id}>
				// 		{item.display_name}
				// 	</li>
				// )

				//testing:
				if(filter === 'common'){
					guest = guest.filter(r =>{return r.common});
				}

				//todo: not getting these yet
				var top = guest.filter(r =>{return r.source === 'top'})

				//user selection required: favorite playlists
				//Favorite Artists (copy from above)
				_tiles = guest

				setItems(_items)
				setTiles(_tiles)

			//todo: was trying to make quick comp here for display
			// _items.push({label:"Top Artists",value:<ListArtists artists={source.artists_top}/>,width:"240px"})
			// _items.push({label:"Common Saved Artists",value:_common.length,width:"120px"})


			// _items.push({label:"Common Saved Tracks",value:source.followed,width:"120px"})
			// //todo:  # of + link to table which auto-filters on
			// _items.push({label:"Collaborative Playlists:",value:source.collaborative,width:"120px"})


			// code block
		}

		return function cleanup() {
			console.log("componentWillUnmount");
		};
	},[statcontrol.stats.name,selectedTabIndex,filter]);

	// var x = 0;
	// if(statcontrol_prev === null){statcontrol_prev = statcontrol.stats.name;x++;}
	// if(statcontrol_prev === statcontrol.stats.name && x === 0){
	// 	console.log("same value, skip",statcontrol.stats.name);
	// }

	//_items.length !== 0 && items.length === 0 ? setItems(_items):{};

	//-----------------------------------------------
	const MyCustomWrapper = React.forwardRef((props, ref) => {
		// MyCustomWrapper really renders a div which wraps the children.
		// Setting the ref on it allows container query to measure its size.
		return <div ref={ref}>{props.children}</div>
	});

	const printParams = (params) =>{
		console.log(params);
	}

	//const columns = useMedia([ '(min-width: 1500px)', '(min-width: 1400px)'], [ 4, 3], 2)
	const columns = 4;
	//note: this width divided by # of columns = the width of one item
	const width = 559;

	//note: replaced all references to data-height (designed to be unique values 300-500) with uHeight

	// const uHeight = 480;
	const uHeight = 260;

	const [heights, gridItems] = useMemo(() => {
		let heights = new Array(columns).fill(0) // Each column gets a height starting with zero
		let gridItems = tiles
			// .filter(i =>{return i.term === term})
			// .filter(i =>{return families.length === 0 ? true: families.indexOf(i.familyAgg) !== -1})
			.map((child, i) => {
				const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
				const xy = [(width / columns) * column, (heights[column] += uHeight / 2) - uHeight / 2] // X = container width / number of columns * column index, Y = it's just the height of the current column
				return { ...child, xy, width: width / columns, height: uHeight / 2 }
			})
		return [heights, gridItems]
	}, [columns, width,tiles])
	// props.data.filter(i =>{return i.term === term})

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





	return(
		<div>
			{/*<MyCustomWrapper ref={containerRef} className={classnames(params)}>the box</MyCustomWrapper>*/}
			{/*<ContainerQuery query={query}>*/}
			{/*	{(params) => (*/}
			{/*		<div className={classnames(params)}>the box {printParams(params)} </div>*/}

			{/*	)}*/}
			{/*</ContainerQuery>*/}
			{/*todo: not understanding why this doesn't obey width constraint 30em*/}
			{/*so I just changed it to 35em LOL - basing this off the 60em on the tabify ... or was that not making any difference?*/}
			{/*real question comes in with the panes - currently doing any window shrinking @ 35em flexes it sends it to the bottom*/}

			{statcontrol.stats.name === '123028477' &&
			<div>
				<Tabs
					value={selectedTabIndex}
					onChange={handleChange}
					aria-label="simple tabs example"
				>
					<Tab
						onMouseOver={(event) => event.target.click()}
						label="Playlists"
					/>
					<Tab
						onMouseOver={(event) => event.target.click()}
						label="Artists"
					/>
					<Tab
						onMouseOver={(event) => event.target.click()}
						label="Albums"
					/>
					<Tab
						onMouseOver={(event) => event.target.click()}
						label="Songs"
					/>
				</Tabs>
				<TabPanel value={selectedTabIndex} index={0}>
					Item One
				</TabPanel>
				<TabPanel value={selectedTabIndex} index={1}>
					<button onClick={() =>{setFilter(filter==='common'?null:'common')}}>Common</button>
				</TabPanel>
				<TabPanel value={selectedTabIndex} index={2}>
					Item Three
				</TabPanel>
				<TabPanel value={selectedTabIndex} index={3}>
					Item Four
				</TabPanel>
			</div>
			}
			<div  className="list" style={{height: Math.max(...heights)}}>
				{transitions.map(({item, props: {xy, ...rest}, key}) => (
					<a.div key={key}
						   style={{transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`), ...rest}}>
						{/*<div style={{backgroundImage: item.css}} />*/}
						{/*todo: sometimes [0] might not be the one I'm looking for?*/}

						<div>
							<img height={120} src={item.images[0] && item.images[0].url}/>
							<div style={{padding:"2px",background:"rgb(128 128 128 / .7)",position:"relative",top:"-43px",color:"white",height:"20px"}}>{item.name}</div>
						</div>

						{/*<div>{item.images[0].url}</div>*/}
					</a.div>
				))}
			</div>
			{items.length > 0 &&
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
			</div>}
			{/*{props.genres.length > 0 &&*/}
			{/*<div>*/}
			{/*	<ListGenres genres={props.genres}/>*/}
			{/*</div>*/}
			{/*}*/}
		</div>)
}
export default ContextStats
