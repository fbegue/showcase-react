import React, {Component, useState} from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import './MenuBar.css'
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import Moment from 'moment';

import Drawer from '@material-ui/core/Drawer'
//import { withStyles } from 'material-ui/core/styles'
import { Link } from 'react-router-dom'
import Divider from "./Sidebar";

//import menuItems from './menuItems'
var menuItems = {
	"data" : [
		{
			"name": "Item1",
			"url": "/item1"
		},
		{
			"name": "Item2",
			"url": "/item2"
		},
		{
			"name": "Item3",
			"childrenKey":"children",
			"children": [
				{
					"name": "Child31",
					"url": "/child31"
				},
				{
					"name": "Child32",
					"url": "/child32"
				},
				{
					"name": "Child32",
					"childrenKey":"children",
					"children": [
						{
							"name": "Child321",
							"url": "/child31"
						},
						{
							"name": "Child322",
							"url": "/child32"
						},
						{
							"name": "Child323",
							"url": "/child32"
						}
					]
				}
			]
		},
		{
			"name": "Item4",
			"childrenKey":"children",
			"children": [
				{
					"name": "Child41",
					"url": "/child41"
				},
				{
					"name": "Child42",
					"url": "/child42"
				},
				{
					"name": "Child43",
					"childrenKey":"testKey",
					"testKey": [
						{
							"name": "Child431",
							"url": "/child431"
						},
						{
							"name": "Child432",
							"url": "/child432,"
						},
						{
							"name": "Child433",
							"url": "/child433"
						}
					]
				}
			]
		}
	]
}


// const styles = {
// 	list: {
// 		width: 250,
// 	},
// 	links: {
// 		textDecoration:'none',
// 	}
// 	menuHeader: {
// 		paddingLeft: '30px'
// 	}
// };

function MenuBar (props){

	// constructor( props ) {
	// 	super( props )
	// 	this.state = {};
	// 	this.data = props.data;
	// 	this.rerender = function(){
	// 		console.log("rerender");
	// 	};
	// 	console.log("this.data",this.data);
	// }

	//var state = {};
	let [state, setState] = useState({});

// this method sets the current state of a menu item i.e whether it is in expanded or collapsed or a collapsed state
	var handleClick =function( item ) {
		setState( prevState => (
			{ [ item ]: !prevState[ item ] }
		) )
	}



	//seems like start.date is always guaranteed, don't know about datetime, time
	//we'll take either here, defaulting to time if no datetime
	//if time's not there, we get nothing back
	var moment = function(dt,format){
		//console.log("$m",Moment(dt).format(format));
		if(dt.length){
			dt[0] ? dt = dt[0]:dt = dt[1]
		}
	    if(Moment(dt).format(format) !== 'Invalid date'){
			return(<React.Fragment> {Moment(dt).format(format)} </React.Fragment>) //basically you can do all sorts of the formatting and others
		}else{return ""}
	};



// if the menu item doesn't have any child, this method simply returns a clickable menu item that redirects to any
// location and if there is no child this method uses recursion to go until the last level of children and then returns the item by the first condition.
	var handler = function( children ) {

		//const { state } = this
		return children.map( ( subOption ) => {
			if ( !subOption.childrenKey ) {
				return (
					<div key={ subOption.displayName }>
						<ListItem
							button
							key={ subOption.displayName }
							className={'nestedCustom'}>
							{subOption.displayName}

							{/*<Link*/}
								{/*to={ subOption.url }*/}
								{/*className={ classes.links }>*/}
								{/*<ListItemText*/}
									{/*inset*/}
									{/*primary={ subOption.displayName }*/}
								{/*/>*/}
							{/*</Link>*/}
						</ListItem>
					</div>
				)
			}
			return (
				<div key={ subOption.displayName }>
					<ListItem
						button
						onClick={ () => handleClick( subOption.displayName ) }>
						<ListItemText
							inset
							primary={ subOption.displayName.toString().replace(/at.*/,"")}
							secondary={
								<React.Fragment>
									<Typography
										component="span"
										variant="body2"
										// className={classes.inline}
										color="textPrimary"
									>
										{moment(subOption.start.date,'MMM do')}
										{moment([subOption.start.datetime,subOption.start.time],'LT')}
									</Typography>
									{subOption.venue.displayName} -
									{subOption.location.city.toString().replace(", US","")}
								</React.Fragment>
							}
						/>

						{ state[ subOption.displayName ] ?
							<ExpandLess /> :
							<ExpandMore />
						}
					</ListItem>
					<Collapse
						in={ state[ subOption.displayName ] }
						timeout="auto"
						unmountOnExit
					>
						{ handler( subOption[subOption.childrenKey] ) }
					</Collapse>
				</div>
			)
		} )
	};

	var classes = {menuHeader:"menuHeader",list:"list",links:"links"};

		return (
			<div className={classes.list}>
						<List>
							<ListItem
								key="menuHeading"
								divider
								disableGutters
							>
								<ListItemText
									className={ classes.menuHeader }
									inset
									primary="Events"
								/>
							</ListItem>
							{/*{ this.handler( menuItems.data ) }*/}
							{ handler( props.data ) }
						</List>
			</div>
		)
}
// export default withStyles(styles)(MenuBar_class)
export default MenuBar