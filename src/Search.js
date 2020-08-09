import React, {useContext, useState} from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import MaterialTable from "material-table";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

import api from "./api/api";
import {Context} from "./alasql/Store";
import ChipsArray from "./ChipsArray";

//source demo
//https://material-ui.com/components/autocomplete/
// https://codesandbox.io/s/pvjgx

//(me playing with making it async update)
//https://codesandbox.io/s/material-demo-ow6hb?file=/demo.js

export default function Search() {

	//----------------------------
	// table stuff

	//artistSearch
	const [state, dispatch] = useContext(Context);

	function add(artist){
		console.log("adding",artist);
		dispatch({type: 'select', payload:artist,context:'artistSearchSelect'});
	}

	//todo:
	// function remove(artist){
	// 	console.log("adding",artist);
	// 	dispatch({type: 'select', payload:artist,context:'artistSearchDeselect'});
	// }


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

		console.log("selected",rows.length);
		//todo:
		//dispatch({type: 'select', payload:rows[0],user:user,context:'artists'});
	}


	//----------------------------
	// table stuff

	const [open, setOpen] = React.useState(false);
	const [options, setOptions] = React.useState([]);
	const loading = open && options.length === 0;

	var response = {};

	//updates the query on input keystroke
	async function update(up) {
		//console.log("update", up);
		response = await api.completeArtist(up);
		setOptions(response);
	}

	React.useEffect(() => {
		let active = true;

		if (!loading) {
			return undefined;
		}

		(async () => {
			if (active) {
				setOptions([])
			}
		})();

		return () => {
			active = false;
		};
	}, [loading]);


	// React.useEffect(() => {
	//   if (!open) {
	//     setOptions([]);
	//   }
	// }, [open]);

	return (
		<div>
		<Autocomplete
			id="asynchronous-demo"
			style={{ width: 300 }}
			open={open}
			onOpen={() => {
				setOpen(true);
			}}
			onClose={() => {
				setOpen(false);
			}}
			onInputChange={(event, newInputValue) => {
				update(newInputValue);
			}}
			onChange={(event, newValue) => {
				add(newValue)
			}}
			getOptionSelected={(option, value) => option.name === value.name}
			getOptionLabel={(option) => option.name}
			options={options}
			loading={loading}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Asynchronous"
					variant="outlined"
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<React.Fragment>
								{loading ? (
									<CircularProgress color="inherit" size={20} />
								) : null}
								{params.InputProps.endAdornment}
							</React.Fragment>
						)
					}}
				/>
			)}
		/>
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
						render: rowData => <ChipsArray chipData={rowData.genres}/>,
						// render: rowData => getChips(rowData.genres),
						// render: rowData => <span>{ChipsArray(rowData.genres)}</span>,
						filtering:false,
						width:"15em"
					},
				]}
				data={state["artistSearchSelection"]}
				options={{
					search: true,
					filtering: true,
					selection: true,
					tableLayout:"fixed"
				}}
				onSelectionChange={(rows) => handleSelect(rows)}
			/>
		</div>
	)
}