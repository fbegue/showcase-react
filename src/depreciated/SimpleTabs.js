import React from 'react';
import PropTypes from 'prop-types';
//import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SimpleTabsLibrary from "./SimpleTabsLibrary";
//import Box from '@material-ui/core/Box';


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

export default function SimpleTabs() {
	//const classes = useStyles();
	const classes = {root:"root"}
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	return (
		<span style={{width:"70em"}} className={classes.root}>
			<AppBar position="static">
				<Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
					<Tab label="My Library" {...a11yProps(0)} />
					<Tab label="My Profile" {...a11yProps(1)} />
					<Tab label="My Friends" {...a11yProps(2)} />
					<Tab label="Billboards" {...a11yProps(2)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				{/*todo: was trying to nest these tabs here but doesn't play nicely*/}
				{/*something I'm apparantly not fucking understanding about how Material UI genreates shit*/}
				{/*validateDOMNesting(...): <div> cannot appear as a descendant of <p>.*/}
					{/*<SimpleTabsLibrary></SimpleTabsLibrary>*/}
			</TabPanel>
			<SimpleTabsLibrary></SimpleTabsLibrary>
			<TabPanel value={value} index={1}>
				My Profile
			</TabPanel>
			<TabPanel value={value} index={2}>
				My Friends
			</TabPanel>
			<TabPanel value={value} index={3}>
				Billboards
			</TabPanel>
		</span>
	);
}
