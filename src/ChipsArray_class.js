import React from "react";

class YourComponent extends React.Component {

	const styles = theme => ({
		root: {
			backgroundColor: theme.palette.background.paper,
			width: 500,
		},
		mySelectedA: {
			color: 'blue'
},
mySelectedB: {
	color: red
},

});

render() {
	const { classes, theme } = this.props;
	// ... logic for someCondition
	const classToUse = someCondition ? "mySelectedA" : "mySelectedB";
	//...
	return (
		<div className={classes.root}>
			<Tabs>
				<Tab label="Item One" classes ={{ selected: classes[classToUse]}} />
			</Tabs>
		</div>
	);
}

}

export default withStyles(styles, { withTheme: true })(YourComponent);