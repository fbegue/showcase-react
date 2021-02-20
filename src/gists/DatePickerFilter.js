import React, {useState} from "react";

//for use with material-table
//this is an example via:
 //https://github.com/mbrn/material-table/issues/671
//and its what I based my CustomSelect on

const CustomSelect = (props) => {

	var exampleData = [
		{ name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
		{ name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
	];

	const [date, setDate] = useState(null);
	console.log("CustomSelect",props);
	const handleChange = (event) => {
		setDate(event.target.value);
		props.onFilterChanged(props.columnDef.tableData.id, event.target.value);
	};
	return (
		<DatePicker
			label="Select Date"
			inputVariant="outlined"
			variant="inline"
			format="dd/MM/yyyy"
			value={date}
			ampm
			autoOk
			allowKeyboardControl
			style={{ minWidth: 175 }}
			onChange={(event) => {
				setDate(event);
				props.onFilterChanged(props.columnDef.tableData.id, event);
			}}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<IconButton>
							<EventIcon />
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	)
}
