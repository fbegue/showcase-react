import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from "@material-ui/core/List";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
}));

export default function NestedGrid() {
	const classes = useStyles();

	function FormRow(props) {
		return (
			<React.Fragment>
				{props.recs.map( t =>
					<Grid item xs={4}>
						<Paper className={classes.paper}>{t}</Paper>
					</Grid>
				)}
			</React.Fragment>
		);
	}

	return (
		<div className={classes.root}>
			<Grid container spacing={1}>
				<Grid container item xs={12} spacing={3}>
					<FormRow recs={["idea1","idea2"]}/>
				</Grid>
				<Grid container item xs={12} spacing={3}>
					<FormRow recs={["idea1","idea2"]}/>
				</Grid>
				<Grid container item xs={12} spacing={3}>
					<FormRow recs={["idea1","idea2"]}/>
				</Grid>
			</Grid>
		</div>
	);
}