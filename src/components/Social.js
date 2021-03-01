import React, {useContext, useState} from 'react';
import DiscreteSlider from "../Slider";
import MaterialTable from "material-table";
import ChipsArray from "../ChipsArray";
import api from "../api/api";
import {Context, initUser} from "../storage/Store";
import {StatControl,Control} from "../index";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR} from "../storage/withApolloProvider";


function Social(props) {

	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	let control = Control.useContainer();
	let statcontrol = StatControl.useContainer();

	//todo:
	const [term, setTerm] = useState('medium');

	//testing: not being sent yet
	var guest = {id:123028477,name:"Dan"};
	function setStatic(){
		api.fetchStaticUser()
			.then(r =>{
				initUser(guest);
				globalDispatch({type: 'init', user:guest,payload:r[0].data,context:'artists'});
			},err =>{
				console.log(err);
			})
	}

	var handleSelectGuest = function(rows){
		//here I'm just accessing the 'checked' rows directly later, so null payload here
		//console.log("selected",rows.length);
		globalDispatch({type: 'select', payload:null,user: globalUI.user,context:'artists',control:control,stats:statcontrol});

	}

	function getSrc(item){
		var ret = false;
		item.owner.images[0] ? ret= item.owner.images[0].url:{}
		return ret;
	}
	return(
		<div>
			<div>
				Common Saved Artists: (create node from here?)
				Common Saved Tracks:
				Collaborative Playlists: (# and link to table that auto-filtered)

				{globalState['spotifyusers'] &&
				<div>
					{/*testing: collabUsers only (remember they special)*/}
					{globalState['spotifyusers'].collabUsers.map((item, i) => (
						<div> {getSrc(item) && <img src={getSrc(item)} />}  </div>
					))}
				</div>
				}
			</div>
		<button onClick={setStatic}>getstuff</button>
		<DiscreteSlider handleChange={(v) =>{setTerm(v)}}/>

		{/*todo: disable for now until content shown*/}
		{globalState[guest.id + "_artists"] && <MaterialTable
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
			data={globalState[guest.id + "_artists"].filter(i =>{return i.term === term})}
			options={{
				search: true,
				filtering: true,
				selection: true,
				tableLayout:"fixed"
			}}
			onSelectionChange={(rows) => handleSelectGuest(rows,'top')}
		/>
		}

	</div>)
}
export default Social;
