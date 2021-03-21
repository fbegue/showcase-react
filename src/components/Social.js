import React, {useContext, useState,useEffect} from 'react';
import DiscreteSlider from "../Slider";
import MaterialTable from "material-table";
import ChipsArray from "../ChipsArray";
import api from "../api/api";
import {Context, initUser} from "../storage/Store";
import {StatControl,Control} from "../index";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR} from "../storage/withApolloProvider";
import {families,familyColors} from "../families";
import _ from "lodash";
import VennChart from "./VennChart";
import util from "../util/util";
const uuid = require('react-uuid')



function Social(props) {

	const [globalState, globalDispatch] = useContext(Context);
	const globalUI = useReactiveVar(GLOBAL_UI_VAR);
	let control = Control.useContainer();
	let statcontrol = StatControl.useContainer();

	//testing: need to hookup selection
	var guest = {id:123028477,name:"Dan"};

	 const {vennData} = util.useProduceData(guest)

	//todo:
	const [term, setTerm] = useState('medium');

	function setStatic(){
		console.log("setStatic");
		api.fetchStaticUser()
			.then(r =>{
				initUser(guest);
				globalDispatch({type: 'init', user:guest,payload:r[0].data,context:'artists'});
			},err =>{
				console.log(err);
			})
	}
	useEffect(()=>{
		setStatic();
	},[])





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

				{/*<button onClick={changeData}>changeData</button>*/}
				{/*<button onClick={st}>trigger</button>*/}
				<div style={{display:"flex"}}>

				</div>


				{globalState['spotifyusers'] &&
				<div>
					{/*testing: collabUsers only (remember they special)*/}
					{globalState['spotifyusers'].collabUsers.map((item, i) => (
						<div> {getSrc(item) && <img  style={{height:"4em"}} src={getSrc(item)} />}  </div>
					))}
				</div>
				}
			</div>
			<button onClick={setStatic}>getstuff</button>
			<DiscreteSlider handleChange={(v) =>{setTerm(v)}}/>

			{/*todo: disable for now until content shown*/}
			{/*{globalState[guest.id + "_artists"] && <MaterialTable*/}
			<VennChart data={vennData}/>
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
				data={globalState[guest.id  + "_artists"].filter(i =>{return i.term === term})}
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
