import React, {useContext, useState, useEffect, useMemo} from 'react';
import DiscreteSlider from "../Slider";
import MaterialTable from "material-table";
import {Select} from '@material-ui/core';
import ChipsArray from "../ChipsArray";
import api from "../api/api";
import {Context, initUser} from "../storage/Store";
import {StatControl, Control, FriendsControl,PaneControl} from "../index";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR} from "../storage/withApolloProvider";
import {families,familyColors} from "../families";
import _ from "lodash";
import VennChart from "./VennChart";
import util from "../util/util";
import BubbleChart from "./BubbleChart";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import classnames from 'classnames';
import { useContainerQuery, ContainerQuery } from 'react-container-query';

import './Social.css'
import {FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio} from '@material-ui/core';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import useMedia from "./Masonry/useMedia";
import {a, useTransition} from "react-spring";

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
		position: 'relative',
		overflow: 'auto',
		maxHeight: 300,
	},
	large: {
		width: theme.spacing(7),
		height: theme.spacing(7),
	},
}));

const uuid = require('react-uuid')

function Social(props) {

	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	let control = Control.useContainer();
	let statcontrol = StatControl.useContainer();

	//testing: need to hookup selection
	// var guest = {id:123028477,name:"Dan"};
	//testing: it's me against... me?
	//recall that I also end up setting this in the backend b/c my user is coming from the
	//auth using my code (0 point in sending user from here, then)

	var guest = {id:"dakootyman01",name:"Francis Begoo"};

	const {vennData} = util.useProduceData(guest)

	//todo:
	const [term, setTerm] = useState('medium');

	function setStatic(){
		console.log("setStatic");
		let req = {auth:globalUI};
		api.fetchStaticUser(req)
			.then(r =>{
				initUser(guest);
				globalDispatch({type: 'init', user:guest,payload:r.artists,context:'artists'});
			},err =>{
				console.log(err);
			})
	}
	useEffect(()=>{
		setStatic();
	},[])


	var handleSelectGuest = function(rows){
		//here I'm just accessing the 'checked' rows directly later, so null payload here
		//console.log("selected",rows.length);
		globalDispatch({type: 'select', payload:null,user: globalUI.user,context:'artists',control:control,stats:statcontrol});

	}


	//-------------------------------------------------

	let friendscontrol = FriendsControl.useContainer()



	const classes = useStyles();

	let panecontrol = PaneControl.useContainer()
	//const columns = useMedia(['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'], [5, 4, 3], 2)

	//---------------------------------------------------------------------
	const query = {
		'width-between-400-and-599': {
			minWidth: 400,
			maxWidth: 599,
		},
		'width-larger-than-600': {
			minWidth: 600,
		},
	};


	//todo: infinite loop just from calling the hook = fucked for now
	// const [params, containerRef] = useContainerQuery(query);
	// console.log("params",params);
	// const columns = params["width-between-400-and-599"] ? 4:5;

	//testing: playing around with doing it manually
	//const changeMedia = (size) =>{
	// 	console.log("changeMedia",size);
	// 	return size < 900 ? 4:5
	// }
	//const columns = changeMedia(panecontrol.pane)

	const columns = 5;

	//----------------------------------------------------------------------

	// Hook2: Measure the width of the container element
	//todo: disabled this b/c of 'illegal invocation' when moving off this component
	//related to bind - possibly b/c I'm destroying the element below that I would be binding to
	//...and then like it realizes that it's invalid and complains? idk
	//const [bind, { width }] = useMeasure()
	//console.log("bind",bind);
	//console.log("width",width);

	//note: this width divided by # of columns = the width of one item
	const width = 955;

	//note: replaced all references to data-height (designed to be unique values 300-500) with uHeight

	// const uHeight = 480;
	const uHeight = 370;

	const [heights, gridItems] = useMemo(() => {
		let heights = new Array(columns).fill(0) // Each column gets a height starting with zero
		let gridItems = globalState['spotifyusers']
			// .filter(i =>{return i.term === term})
			// .filter(i =>{return families.length === 0 ? true: families.indexOf(i.familyAgg) !== -1})
			.map((child, i) => {
				const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
				const xy = [(width / columns) * column, (heights[column] += uHeight / 2) - uHeight / 2] // X = container width / number of columns * column index, Y = it's just the height of the current column
				return { ...child, xy, width: width / columns, height: uHeight / 2 }
			})
		return [heights, gridItems]
	}, [columns, width,globalState['spotifyusers']])
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


	//----------------------------------------------------------------------
	//todo: tracking this in two places
	//im testin some BS with the stats so maybe this'll change later
	const [selectedUser, setSelectedUser] = React.useState(null);

	return(
		// <div ref={containerRef} className={classnames(params)}>
		<div>
			<div>
				{/*<button onClick={changeData}>changeData</button>*/}
				{/*<button onClick={st}>trigger</button>*/}
				<div style={{display:"flex"}}>

				</div>
				{globalState['spotifyusers'] &&
				<div>
					<div  className="list" style={{height: Math.max(...heights)}}>
						{transitions.map(({item, props: {xy, ...rest}, key}) => (
							<a.div key={key} onClick={(event) => {statcontrol.setStats({name:item.id,user:item});setSelectedUser(item)}}
								   style={{transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`), ...rest}}>
								{/*<div style={{backgroundImage: item.css}} />*/}
								{/*todo: sometimes [0] might not be the one I'm looking for?*/}

								<div className={selectedUser && selectedUser.id === item.id ? 'user-selected':'user-unselected' }>
									<img height={150} src={item.images[0] && item.images[0].url}/>
									<div style={{padding:"2px",background:"rgb(128 128 128 / .7)",position:"relative",top:"-22px",color:"white",height:"20px"}}>{item.display_name}</div>
								</div>

								{/*<div>{item.images[0].url}</div>*/}
							</a.div>
						))}
					</div>
					{/*<List className={classes.root} >*/}
					{/*	{globalState['spotifyusers'].map((item, i) => (*/}
					{/*		<ListItem selected={selectedUser && selectedUser.id === item.id}  onClick={(event) => setSelectedUser(item)} key={item.id}>*/}
					{/*			<ListItemAvatar style={{marginRight:".5em"}}>*/}
					{/*				{item.images[0] ?*/}
					{/*				<Avatar className={classes.large} src={item.images[0].url}/>*/}
					{/*					: <Avatar  className={classes.large} >?</Avatar>*/}
					{/*					}*/}
					{/*			   </ListItemAvatar>*/}
					{/*			<ListItemText primary={item.display_name} secondary={"id: " + item.id}/>*/}
					{/*			<div> </div>*/}
					{/*		</ListItem>*/}
					{/*	))}*/}
					{/*</List>*/}
				</div>
				}
			</div>

			{/*<div><BubbleChart  options={{...bubbleOptions,series:bubbleData}}/></div>*/}
			<button onClick={setStatic}>getstuff</button>
			<DiscreteSlider handleChange={(v) =>{setTerm(v)}}/>

			{globalState[guest.id + "_artists"] && <MaterialTable
				title=""
				columns={[
					{
						field: 'images[0]',
						title: '',
						render: rowData => <img src={rowData.images[0].url} style={{width: 50, borderRadius: '50%'}}/>,
						filtering:false,
						width:"5em"
					},
					{ title: 'Name', field: 'name', filtering:false},
					{
						field: 'genres',
						title: 'genres',
						//ender: rowData => getChips(rowData.genres),
						render: rowData => <ChipsArray chipData={rowData.genres}/>,
						filtering:false,
						width:"20em"
					},

				]}
				data={globalState[guest.id  + "_artists"].filter(i =>{return i.term === term})}
				options={{
					search: true,
					filtering: true,
					selection: true,
					tableLayout:"fixed"
				}}
				onSelectionChange={(rows) => handleSelectGuest(rows,'top')}
			/>
			}

		</div>)
}
export default Social;
