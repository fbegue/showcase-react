import React, {} from 'react';
import {StatControl} from "../index";
function Stats(props) {
	let statcontrol = StatControl.useContainer();
	return(<div>
		{statcontrol.stats.name}
	</div>)
}
export default Stats;
