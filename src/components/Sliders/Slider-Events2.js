import {makeStyles} from "@material-ui/core/styles";
import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Tooltip from '@material-ui/core/Tooltip';

/**
 * @param props.defaultValue Number [0,1,2]
 * @param props.handleChange Function Affect outside state
 * */
export default function DiscreteSlider(props) {
	const useStyles = makeStyles((theme) => ({
		root: {
			width: 100
		},
		margin: {
			height: theme.spacing(3)
		}
	}));

	const marks = [
		{
			value: 0,
			label: <Tooltip  enterTouchDelay={0} placement="top" title={''}>
				<span>Exact Genres</span>
			</Tooltip>
		},
		{
			value: 1,
			label: <Tooltip  enterTouchDelay={0} placement="top" title={''}>
				<span>Related Genres</span>
			</Tooltip>
		}
	];

	const map = {0:"genres",1:"families"}
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Slider
				// defaultValue={1}
				defaultValue={props.defaultValue}
				min={0}
				max={1}
				marks={marks}
				// ValueLabelComponent={ValueLabelComponent}
				onChange={(e,v) =>{props.handleChange(map[v])}}
			/>
		</div>
	);
}
