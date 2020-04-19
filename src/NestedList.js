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

import { useDB, useNormalizedApi } from './db'

export default function NestedList(props) {
	//const classes = useStyles();
	const classes = {nested:"nestedCustom",root:"root"}
	const [open, setOpen] = React.useState(true);
	const [open2, setOpen2] = React.useState(true);

	let normalizedApi = useNormalizedApi();

	console.log("NestedList props",props);

	const handleClick = () => {
		setOpen(!open);
	};
	const handleClick2 = () => {
		setOpen2(!open2);
	};
	const setSelect = (g) => {
		//console.log(g);

		//todo: if my goal is to change genres b/c I think that will
		//trigger a change in events in app.js, I need to commit this value
		//do the ALL_GENRES query and therefore the db
		g.selected = !g.selected;
		normalizedApi.updateGenre(g)

	};

	return (
		<List
			component="nav"
			aria-labelledby="nested-list-subheader"
			subheader={
				<ListSubheader component="div" id="nested-list-subheader">
					Artists and Genres
				</ListSubheader>
			}
			className={classes.root}
		>
			<ListItem button onClick={handleClick}>
				<ListItemIcon>
					<InboxIcon />
				</ListItemIcon>
				<ListItemText primary="Artists" />
				{open ? <ExpandLess /> : <ExpandMore />}
			</ListItem>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{props.artists.map((art, index) => (
						<ListItem key={art.id}button className={classes.nested} >
							{/*<ListItemIcon>*/}
								{/*<StarBorder />*/}
							{/*</ListItemIcon>*/}
							<ListItemText primary={art.name} />
						</ListItem>
					))}
				</List>
			</Collapse>
			<ListItem button onClick={handleClick2}>
				<ListItemIcon>
					<InboxIcon />
				</ListItemIcon>
				<ListItemText primary="Genres" />
				{open2 ? <ExpandLess /> : <ExpandMore />}
			</ListItem>
			<Collapse in={open2} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{props.genres.map((g, index) => (
						<ListItem key={g.id}button className={classes.nested} onClick={() => setSelect(g)}>
							{/*<ListItemIcon>*/}
							{/*<StarBorder />*/}
							{/*</ListItemIcon>*/}
							{/*todo: https://material-ui.com/api/list-item-text/*/}
							<ListItemText primary={g.name} secondary={g.rank}/>
						</ListItem>
					))}
				</List>
			</Collapse>
		</List>
	);
}