
// import React, { useState } from 'react';
import React, {useEffect, useContext,useState} from 'react';

import PropTypes from 'prop-types';
//import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
//import Box from '@material-ui/core/Box';
import {useDB, useNormalizedApi} from './db'
import MaterialTable from "material-table";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import alasql from "alasql";
import alasqlAPI from "./alasql/index";
import {Context} from './alasql/Store'


function TabPanel(props) {
	const { children, value, index, ...other } = props;
	return (
		<span
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			<span>	<Typography>{children}</Typography></span>
			{/*todo: having some issue with Box here or anywhere*/}
			{/*{value === index && (*/}
			{/*	<Box p={3}>*/}
			{/*	</Box>*/}
			{/*)}*/}
		</span>
	);
}

// TabPanel.propTypes = {
// 	children: PropTypes.node,
// 	index: PropTypes.any.isRequired,
// 	value: PropTypes.any.isRequired,
// };

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

// const useStyles = makeStyles((theme) => ({
// 	root: {
// 		flexGrow: 1,
// 		backgroundColor: theme.palette.background.paper,
// 	},
// }));



export default function SimpleTabsLibrary() {
	//const classes = useStyles();
	const classes = {root:"root"}
	const [value, setValue] = React.useState(0);

	const [state, dispatch] = useContext(Context);

	var user = 'dacandyman01';
	useEffect(() => {
		//testing:
		alasqlAPI.followedArtists(user)
			.then(r =>{
				dispatch({type: 'init', payload: r,user:user,context:'artists'});
			},err =>{
				console.log(err);
			})
	}, []);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};


	// let pqry = db.getStoredQuery('ALL_PLAYLISTS');
	//todo:
	var playlists = []

	// var user = '123028477'
	// //console.log('h343',alasqlAPI.tables["playlists"][{user}] );
	// playlists = alasqlAPI.tables["playlists"][{user}] ?  alasql("SELECT * from ? playlists",[alasqlAPI.tables["playlists"][{user}]]):[];
	// console.log("$playlists",playlists);

	//todo: concept w/ name of table subbed for t
	// var t = {};
	//
	// var artists = []; var t = "artists";
	// artists = alasqlAPI.tables[t][{user}] ?  alasql("SELECT * from ? " + t,[alasqlAPI.tables[t][{user}]]):[];
	// console.log("artists",artists);

	const setSelect = (g) => {
		//console.log(g);
		g.selected = !g.selected;
		//normalizedApi.updatePlaylist(g)
	};

	//todo:
	// A component is changing an uncontrolled input of type undefined to be controlled.

	//this is an example of how to add a custom filter to material-table via:
	//https://github.com/mbrn/material-table/issues/671

	const CustomSelect = (props) => {
		const [date, setDate] = useState("");
		//console.log("CustomSelect",props);
		const handleChange = (event) => {
			setDate(event.target.value);
			props.onFilterChanged(props.columnDef.tableData.id, event.target.value);
		};
		return (
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={date}
				onChange={handleChange}
			>
				<MenuItem value={null}>&nbsp;&nbsp;&nbsp;</MenuItem>
				{props.options.map((op, index) => (
					<MenuItem key={index} value={op}>{op}</MenuItem>
				))}
			</Select>
		);
	};

	var generateOps = function(playlists){
		var owners = [];
		playlists.forEach(p =>{
			owners.indexOf(p.owner.display_name)  === -1 ? owners.push(p.owner.display_name):{};
		});
		return owners;
	};

// const Dummy = (props) => {return(<div></div>)}

	//return (<span> test</span>)


	function TabContainer(props) {
		return (
			<Typography {...props} component="div" style={{ padding: 8 * 3 }}>
				{props.children}
			</Typography>
		);
	}

	return (
		<div>
			{/*todo: before I said fuck these tabs*/}
			{/*<span className={classes.root}>*/}
			{/*	<AppBar position="static">*/}
			{/*		<Tabs value={value} onChange={handleChange} aria-label="simple tabs example">*/}
			{/*			<Tab label="Saved Artists" {...a11yProps(0)} />*/}
			{/*			<Tab label="Playlists" {...a11yProps(1)} />*/}
			{/*		</Tabs>*/}
			{/*	</AppBar>*/}
			{/*	<TabPanel  value={value} index={0}>*/}
			{/*		*/}
			{/*	</TabPanel>*/}
			{/*</span>*/}
			<MaterialTable
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
					{ title: '# Tracks', field: 'tracks.total',	filtering:false},
					{ title: 'Owner', field: 'owner.display_name',
						filterComponent: (props) => <CustomSelect onFilterChanged={props.onFilterChanged} columnDef={props.columnDef} options={generateOps(playlists)} />,
					}
				]}
				data={playlists}
				options={{
					search: true,
					filtering: true,
					selection: true,
					tableLayout:"fixed"
				}}
			/>

			<MaterialTable
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
					{ title: '# Tracks', field: 'tracks.total',	filtering:false},
					{ title: 'Owner', field: 'owner.display_name',
						filterComponent: (props) => <CustomSelect onFilterChanged={props.onFilterChanged} columnDef={props.columnDef} options={generateOps(playlists)} />,
					}
				]}
				data={state[user + "_artists"]}
				options={{
					search: true,
					filtering: true,
					selection: true,
					tableLayout:"fixed"
				}}
			/>
		</div>


	);
}
