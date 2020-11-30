import {makeStyles} from "@material-ui/core/styles";
import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Tooltip from '@material-ui/core/Tooltip';

function ValueLabelComponent(props) {
	const { children, open, value } = props;
	console.log("$label",value);
	return (
		<Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
			{children}
		</Tooltip>
	);
}

export default function DiscreteSlider(props) {
	const useStyles = makeStyles((theme) => ({
		root: {
			width: 300
		},
		margin: {
			height: theme.spacing(3)
		}
	}));

	const marks = [
		{
			value: 0,
			label: <Tooltip  enterTouchDelay={0} placement="top" title={'several years'}>
				<span>Long Term</span>
			    </Tooltip>
		},
		{
			value: 1,
			label: <Tooltip  enterTouchDelay={0} placement="top" title={'last 6 months'}>
				<span>Medium Term</span>
			</Tooltip>
		},
		{
			value: 2,
			label: <Tooltip  enterTouchDelay={0} placement="top" title={'last 4 weeks'}>
				<span>Short Term</span>
			</Tooltip>
		}
	];

	const map = {0:"long",1:"medium",2:"short"}
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Typography id="discrete-slider-always" gutterBottom>
				Listening History Range
			</Typography>
			<Slider
				defaultValue={1}
				min={0}
				max={2}
				marks={marks}
				// ValueLabelComponent={ValueLabelComponent}
				onChange={(e,v) =>{props.handleChange(map[v])}}
			/>
		</div>
	);
}