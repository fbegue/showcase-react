import React from "react";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from '@material-ui/core/styles';
import {familyColors, familyNormal, familyStyles, genreFam_map} from './families';

//help understanding the override system
//https://material-ui.com/customization/components/#overriding-styles-with-classes

//todo: think I need to expose a genre's family and key off that
//as opposed to looking up the genre's family and then getting the color (even possible?)

const useStyles = makeStyles(familyStyles);


//note: not really sure how I fixed the 'can't use hook unless its in an functional component' thing but whatevs
export default function ChipsArray(props) {

	//var classes = {root:"root",chip:"chip"}
	const classes = useStyles();
	//---------------------------------------------------------------------
	//note: this a temporary thing anyways but really belongs in families
	//it would be there except for the classes bit here

	//todo: some kind of ranking to choose between combos of family names

	//todo: placeholder for a inferencing system
	//used as a short-circuit and as a contrived add-on keys during getLike
	var specialLogic = {};
	specialLogic["rap"] = "hip hop";

	//split the unknown genre at \s and try to find it's keys in our family names
	function getLike(g){
		var match = null
		Object.keys(familyColors).forEach(f => {
			var gkeys = g.split(" ");
			//add on contrived keys
			gkeys.forEach((k, i, arr) => {
				if (specialLogic[k]) {
					arr.push(specialLogic[k])
				}
			})
			gkeys.forEach(k => {
				if (f.indexOf(k) !== -1) {
					//console.log("match: " + g + " to " + f + " on " + k)
					!(match)?match=f:{};
				}
			})
		})
		//!(match)?console.log("failure",g):{}
		return match;
	}


	function getClass(data){
		//console.log(data.name, genreFam_map[data.name]);
		//if the genre is already mapped, return its family
		//todo: not sure what decision to make here when they have < 1 family
		//you would think it would be the [0] one but ex: funk rock => r&b,rock
		//in this example it might be pertinent to just ignore my outdated listing
		//if the genre contains a family name, but something to think about in general

		var f = (genreFam_map[data.name] ? genreFam_map[data.name][0] : specialLogic[data.name] || null);
		if(f){
			//if its one that needs normalized, look that up instead
			return classes[f] || classes[familyNormal[f]]
		}
		else if(!(classes[f])){
			// else if(!(classes[f]) && (getLike(data.name) !== null)){
			var newFam = getLike(data.name);
			//console.log("$",newFam);
			return classes[newFam] || classes[familyNormal[newFam]]
		}
		else{
			//console.log("default");
			return "default"
		}
	}
	//---------------------------------------------------------------------

	const [chipData, setChipData] = React.useState(props.chipData);
	//console.log("$chipData",props.chipData);
	//console.log(classes.colorPrimary);
	//console.log(typeof chipData[0].name);

	//leaving as example on how to interact with later
	const handleDelete = chipToDelete => () => {
		setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
	};



	return (

		<span style={{maxWidth:"40em"}}>
			{chipData.map(data => {
				//let icon = <TagFacesIcon />;
				return (
					<Chip
						key={data.id}
						// icon={icon}
						label={data.name}
						className={classes.chip}
						color="primary"
						classes={{
							//root: classes.root,
							//todo: non-genred events catch
							colorPrimary:data.name?getClass(data):'default'

							//note: again really not fucking understanding this lol
							//colorPrimary:classes.colorPrimary
							//colorPrimary:getColor()
						}}
					/>
				);
			})}
		</span>
	);
}