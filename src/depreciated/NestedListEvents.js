//import './installStyles'
import React from 'react';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import './NestedList.css';



// import { createMuiTheme } from '@material-ui/core/styles';
// import { ThemeProvider } from '@material-ui/styles';
// import { makeStyles } from '@material-ui/styles';
//
// const useStyles = makeStyles(theme => ({
// 	root: {
// 		width: '100%',
// 		maxWidth: 360,
// 		backgroundColor: theme.palette.background.paper,
// 	},
// 	nested: {
// 		paddingLeft: theme.spacing(4),
// 	},
// }));

export default function NestedListEvents(props) {
	//const classes = useStyles();
	const classes = {nested:"nestedCustom",root:"root"}
	const [open, setOpen] = React.useState(true);

	console.log("NestedListEvents props",props);

	const handleClick = () => {
		setOpen(!open);
	};

	return (
		<List
			component="nav"
			aria-labelledby="nested-list-subheader"
			// subheader={
			// 	<ListSubheader component="div" id="nested-list-subheader">
			// 		Events
			// 	</ListSubheader>
			// }
			className={classes.root}
		>
			<ListItem button onClick={handleClick}>
				<ListItemIcon>
					<InboxIcon />
				</ListItemIcon>
				<ListItemText primary="Performances" />
				{open ? <ExpandLess /> : <ExpandMore />}
			</ListItem>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{props.performances.map((perf, index) => (
						<ListItem key={perf.id} button className={'nestedCustom'}>
							<ListItemText primary={perf.displayName} />
						</ListItem>
					))}
				</List>
			</Collapse>
		{/*	<ListItem button onClick={handleClick}>*/}
		{/*		<ListItemIcon>*/}
		{/*			<InboxIcon />*/}
		{/*		</ListItemIcon>*/}
		{/*		<ListItemText primary="Genres" />*/}
		{/*		{open ? <ExpandLess /> : <ExpandMore />}*/}
		{/*	</ListItem>*/}
		{/*	<Collapse in={open} timeout="auto" unmountOnExit>*/}
		{/*		<List component="div" disablePadding>*/}
		{/*			{props.genres.map((g, index) => (*/}
		{/*				<ListItem key={g.id}button className={classes.nested}>*/}
		{/*					/!*<ListItemIcon>*!/*/}
		{/*					/!*<StarBorder />*!/*/}
		{/*					/!*</ListItemIcon>*!/*/}
		{/*					<ListItemText primary={g.name} />*/}
		{/*				</ListItem>*/}
		{/*			))}*/}
		{/*		</List>*/}
		{/*	</Collapse>*/}
		</List>
	);
}