import React from "react";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from '@material-ui/core/styles';
import {familyColors,genreFam_map} from './families';

//help understanding the override system
//https://material-ui.com/customization/components/#overriding-styles-with-classes

//todo: think I need to expose a genre's family and key off that
//as opposed to looking up the genre's family and then getting the color (even possible?)

const useStyles = makeStyles({
	root: {
		// background: 'black',
		// borderRadius: "16px",
		// margin:"2px",
		color: 'white'
	},
	pop:{
		backgroundColor:familyColors['pop']
	},
	rock:{
		backgroundColor:familyColors['rock']
	},
	latin:{
		backgroundColor:familyColors["latin"]
	},
	folk:{
		backgroundColor:familyColors["folk"]
	},
	metal:{
		backgroundColor:familyColors["metal"]
	},
	blues:{
		backgroundColor:familyColors["blues"]
	},
	reggae:{
		backgroundColor:familyColors["reggae"]
	},
	world:{
		backgroundColor:familyColors["world"]
	},
	jazz:{
		backgroundColor:familyColors["jazz"]
	},
	punk:{
		backgroundColor:familyColors["punk"]
	},
	classical:{
		backgroundColor:familyColors["classical"]
	},
});


//note: not really sure how I fixed the 'can't use hook unless its in an functional component' thing but whatevs
export default function ChipsArray(props) {

	//var classes = {root:"root",chip:"chip"}
	const classes = useStyles();

	const [chipData, setChipData] = React.useState(props.chipData);
	//console.log("$chipData",props.chipData);
	//console.log(classes.colorPrimary);
	//console.log(typeof chipData[0].name);

	//leaving as example on how to interact with later
	const handleDelete = chipToDelete => () => {
		setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
	};


	function getClass(data){
		return classes[genreFam_map[data.name]]
	}
	return (

		<div style={{maxWidth:"40em"}}>
			{chipData.map(data => {
				//let icon = <TagFacesIcon />;
				return (
					<Chip
						key={data.id}
						// icon={icon}
						label={data.name}
						// className={classes.chip}
						color="primary"
						classes={{
							//root: classes.root,
							colorPrimary:getClass(data)
							//todo: again really not fucking understanding this lol
							//colorPrimary:classes.colorPrimary
							//colorPrimary:getColor()
						}}
					/>
				);
			})}
		</div>
	);
}