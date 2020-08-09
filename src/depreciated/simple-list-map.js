import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import React from "react";

// old playlists mapping list

var playlists = [];

export default function List1() {

	return(
		<List>
			{playlists.map((play, index) => (
				<ListItem
					button
					key={play.id}
					onClick={() => setSelect(play)}
				>
					<Typography
						variant="subtitle1"
						color={play.selected ? 'secondary' : 'textPrimary'}
					>
						{play.name} - <span style={{fontSize:"10px"}}>{play.owner.display_name}</span>
					</Typography>
				</ListItem>
			))}
		</List>
	)
}
