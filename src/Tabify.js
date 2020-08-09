import React, {useContext, useEffect, useState} from 'react';
//todo: this shit is outdated AF but was so simple I couldn't refuse
//https://github.com/mikechabot/react-tabify#color-theme
//specifically it uses glamorous which has been ditched for emotion as a theme provider
//not sure if I could rip that dependency out myself and just make this my thing or not...
import { Tab, Tabs } from "react-tabify";
import MaterialTable from "material-table";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Context} from "./alasql/Store";
import alasqlAPI from "./alasql";

import ChipsArray from "./ChipsArray";
import Search from './Search'

// const styles = {
// 	fontFamily: "sans-serif",
// 	textAlign: "center"
// };

//todo: also this shit doesn't even work?
//whatever fuck it for now
var color = "#000000";
var materialColor = "#3f51b5";
const theme = {
	tabs: {
		color: color,
		borderBottomColor: color,
		active: {
			borderBottomColor: color,
			color: "#3273dc"
		},
		hover: {
			borderBottomColor: color,
			color: color
		}
	},
	menu: {
		color: color,
		borderRight: color,
		active: {
			backgroundColor: color,
			color: color
		},
		hover: {
			color: color,
			backgroundColor: color
		}
	}
};

function getChips(genres){

	var t = ""
	genres.forEach(g =>{
		t =t + g.name + ", "
	})
	return <span>{t}</span>

};

export default function Tabify() {

	//todo: move this somewhere else higher up
	const [state, dispatch] = useContext(Context);
	useEffect(() => {
		//testing:
		alasqlAPI.followedArtists(user)
			.then(r =>{
				dispatch({type: 'init', payload: r,user:user,context:'artists'});
			},err =>{
				console.log(err);
			})
		alasqlAPI.fetchEvents()
			.then(r =>{
				dispatch({type: 'init', payload: r,context:'events'});
			},err =>{
				console.log(err);
			})
	}, []);

	//todo:
	var playlists = [];
	var user = 'dacandyman01';

	const CustomSelect = (props) => {
		const [date, setDate] = useState("");
		//console.log("CustomSelect",props);
		const handleChange = (event) => {
			setDate(event.target.value);
			props.onFilterChanged(props.columnDef.tableData.id, event.target.value);
		};
		return (
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={date}
				onChange={handleChange}
			>
				<MenuItem value={null}>&nbsp;&nbsp;&nbsp;</MenuItem>
				{props.options.map((op, index) => (
					<MenuItem key={index} value={op}>{op}</MenuItem>
				))}
			</Select>
		);
	};

	var generateOps = function(playlists){
		var owners = [];
		playlists.forEach(p =>{
			owners.indexOf(p.owner.display_name)  === -1 ? owners.push(p.owner.display_name):{};
		});
		return owners;
	};

	var handleSelect = function(rows){
		//todo: confused on how to get selected row?
		//seems like it should be pretty simple?
		//for now just take one - otherwise do a delta? :(
		console.log("selected",rows.length);
		dispatch({type: 'select', payload:rows[0],user:user,context:'artists'});
	}



	return(
		// style={styles}
		<div>
			<Tabs theme={theme} >
				<Tab label="Search">
					<Search></Search>
				</Tab>
				<Tab label="My Library">
					<Tabs>
						<Tab label="Saved Artists">

							<MaterialTable
								title=""
								columns={[
									{
										field: 'images[0]',
										title: '',
										render: rowData => <img src={rowData.images[0].url} style={{width: 50, borderRadius: '50%'}}/>,
										filtering:false,
										width:"5em"
									},
									{ title: 'Name', field: 'name', filtering:false},
									{
										field: 'genres',
										title: 'genres',
										//ender: rowData => getChips(rowData.genres),
										render: rowData => <ChipsArray chipData={rowData.genres}/>,
										filtering:false,
										width:"20em"
									},

								]}
								data={state[user + "_artists"]}
								options={{
									search: true,
									filtering: true,
									selection: true,
									tableLayout:"fixed"
								}}
								onSelectionChange={(rows) => handleSelect(rows)}
							/>

						</Tab>
						<Tab label="Playlists">Tab 1 Content 2</Tab>
						<Tab label="Subtab 1.3">Tab 1 Content 3</Tab>
					</Tabs>
				</Tab>
				<Tab label="My Profile">
					<Tabs>
						<Tab label="Subtab 2.1">Tab 2 Content 1</Tab>
						<Tab label="Subtab 2.2">Tab 2 Content 2</Tab>
						<Tab label="Subtab 2.3">Tab 2 Content 3</Tab>
					</Tabs>
				</Tab>
				<Tab label="My Friends">
					<Tabs>
						<Tab label="Subtab 3.1">Tab 3 Content 1</Tab>
						<Tab label="Subtab 3.2">Tab 3 Content 2</Tab>
						<Tab label="Subtab 3.3">Tab 3 Content 3</Tab>
					</Tabs>
				</Tab>
				<Tab label="Billboards">
					<Tabs>
						<Tab label="Subtab 2.1">Tab 2 Content 1</Tab>
						<Tab label="Subtab 2.2">Tab 2 Content 2</Tab>
						<Tab label="Subtab 2.3">Tab 2 Content 3</Tab>
					</Tabs>
				</Tab>
			</Tabs>
		</div>
	)
}