import React, {Component, useState} from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import './MenuBar.css'

//source
//https://codesandbox.io/s/45my1307
// https://medium.com/p/f8595031995e/responses/show

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
			"depth":2,
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
					"depth":3,
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
			"depth":2,
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
					"depth":3,
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

class MenuBar extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		// function determineDepthOfObject(object) {
		// 	let depth = 0;
		// 	if (object.children) {
		// 		object.children.forEach(x => {
		// 			let temp = determineDepthOfObject(x);
		// 			if (temp > depth) {
		// 				depth = temp;
		// 			}
		// 		})
		// 	}
		// 	return depth + 1;
		// }
		// console.log("depth",determineDepthOfObject(menuItems.data[3]));
	}
	// this method sets the current state of a menu item i.e whether it is in expanded or collapsed or a collapsed state
	handleClick(item) {
		this.setState(prevState => ({ [item]: !prevState[item] }));
	}
	// if the menu item doesn't have any child, this method simply returns a clickable menu item that redirects to any location and if there is no child this method uses recursion to go until the last level of children and then returns the item by the first condition.
	handler(children) {

		//was trying a depth-based style here.
		// function getDepth(d){
		// 	return {marginLeft: d + 'em',color: 'blue'}
		// }
		// style={getDepth(subOption.depth)}

		const { classes } = this.props;
		const { state } = this;
		return children.map(subOption => {
			if (!subOption.childrenKey) {
				return (
					<div key={subOption.name}>
						{/*style={getDepth(subOption.depth || 1)}*/}
						<ListItem  button key={subOption.name}>
							{subOption.name}
						</ListItem>
					</div>
				);
			}
			return (
				<div key={subOption.name}>

					<ListItem  button onClick={() => this.handleClick(subOption.name)}>
						<ListItemText inset primary={subOption.name} />
						{state[subOption.name] ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<Collapse in={state[subOption.name]} timeout="auto" unmountOnExit>
						{this.handler( subOption[subOption.childrenKey] ) }
					</Collapse>
				</div>
			);
		});
	}
	render() {
		//const { classes, drawerOpen, menuOptions } = this.props;
		//todo:
		var classes = {menuHeader:"menuHeader",list:"list"};
		return (
			<div className={classes.list}>
				<List>
					<ListItem  key="menuHeading" divider disableGutters>
						<ListItemText
							//className={classes.menuHeader}
							// style={getStyle()}
							inset
							primary="Nested Menu"
						/>
					</ListItem>
					{this.handler(menuItems.data)}
				</List>
			</div>
		);
	}
}
// export default withStyles(styles)(MenuBar_class)
export default MenuBar