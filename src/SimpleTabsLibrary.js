import React from 'react';
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
			<span>	<Typography>{children}</Typography></span>
			{/*todo: having some issue with Box here or anywhere*/}
			{/*{value === index && (*/}
			{/*	<Box p={3}>*/}
			{/*	</Box>*/}
			{/*)}*/}
		</div>
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

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	let normalizedApi = useNormalizedApi()
	let db = useDB();

	let pqry = db.getStoredQuery('ALL_PLAYLISTS');
	let playlists = db.executeQuery(pqry);

	const setSelect = (g) => {
		//console.log(g);
		g.selected = !g.selected;
		normalizedApi.updatePlaylist(g)
	};

var exampleData = [
		{ name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
		{ name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
	];
	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
					<Tab label="Saved Artists" {...a11yProps(0)} />
					<Tab label="Playlists" {...a11yProps(1)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				Saved Artists
			</TabPanel>
			<TabPanel value={value} index={1}>
				{/*<MaterialTable*/}
				{/*	title="Basic Search Preview"*/}
				{/*	columns={[*/}
				{/*		{ title: 'Name', field: 'name' },*/}
				{/*		{ title: '# Tracks', field: 'tracks.total' },*/}
				{/*		{ title: 'Owner', field: 'owner.display_name'},*/}
				{/*		// { title: 'Owner', field: 'owner.display_name', type: 'numeric' },*/}
				{/*		// {*/}
				{/*		// 	field: 'url',*/}
				{/*		// 	title: 'Avatar',*/}
				{/*		// 	render: rowData => <img src={rowData.url} style={{width: 50, borderRadius: '50%'}}/>*/}
				{/*		// }*/}
				{/*		// {*/}
				{/*		// 	title: 'Birth Place',*/}
				{/*		// 	field: 'birthCity',*/}
				{/*		// 	// lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },*/}
				{/*		// },*/}
				{/*	]}*/}
				{/*	data={playlists}*/}
				{/*	// data={exampleData}*/}
				{/*	options={{*/}
				{/*		search: true*/}
				{/*	}}*/}
				{/*/>*/}
				{/*<List>*/}
				{/*	{playlists.map((play, index) => (*/}
				{/*		<ListItem*/}
				{/*			button*/}
				{/*			key={play.id}*/}
				{/*			onClick={() => setSelect(play)}*/}
				{/*		>*/}
				{/*			<Typography*/}
				{/*				variant="subtitle1"*/}
				{/*				color={play.selected ? 'secondary' : 'textPrimary'}*/}
				{/*			>*/}
				{/*				{play.name} - <span style={{fontSize:"10px"}}>{play.owner.display_name}</span>*/}
				{/*			</Typography>*/}
				{/*		</ListItem>*/}
				{/*	))}*/}
				{/*</List>*/}
			</TabPanel>
		</div>
	);
}
