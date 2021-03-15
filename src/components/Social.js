import React, {useContext, useState,useEffect} from 'react';
import DiscreteSlider from "../Slider";
import MaterialTable from "material-table";
import ChipsArray from "../ChipsArray";
import api from "../api/api";
import {Context, initUser} from "../storage/Store";
import {StatControl,Control} from "../index";
import {useReactiveVar} from "@apollo/react-hooks";
import {GLOBAL_UI_VAR} from "../storage/withApolloProvider";
import BubbleChart from "./BubbleChart";
import {families,familyColors} from "../families";
import _ from "lodash";
// import * as d3 from "d3";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_more from 'highcharts/highcharts-more'
HC_more(Highcharts)
const uuid = require('react-uuid')



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

	// const d = [
	// 	{ id: 1, name: 'React', size: 350, fillColor: '#D3D3D3' },
	// 	{ id: 2, name: 'TypeScript', size: 100, fillColor: '#9d9a9f' },
	// 	{ id: 3, name: 'SCSS', size: 75, fillColor: '#605f62' },
	// 	{ id: 4, name: 'Recoil', size: 150, fillColor: '#D3D3D3' },
	// 	{ id: 5, name: 'Redux', size: 150, fillColor: '#D3D3D3' },
	// 	{ id: 6, name: 'Material-UI', size: 125, fillColor: '#c6c5c6' },
	// 	{ id: 7, name: 'Router', size: 230, fillColor: '#808080' },
	// 	{ id: 8, name: 'Jest', size: 70, fillColor: '#C0C0C0' },
	// 	{ id: 9, name: 'Enzym', size: 70, fillColor: '#C0C0C0' },
	// 	{ id: 10, name: 'Sinon', size: 70, fillColor: '#C0C0C0' },
	// 	{ id: 11, name: 'Puppeteer', size: 70, fillColor: '#C0C0C0' },
	// 	{ id: 12, name: 'ESLint', size: 50, fillColor: '#A9A9A9' },
	// 	{ id: 13, name: 'Prettier', size: 60, fillColor: '#A9A9A9' },
	// 	{ id: 14, name: 'Lodash', size: 70, fillColor: '#DCDCDC' },
	// 	{ id: 15, name: 'Moment', size: 80, fillColor: '#DCDCDC' },
	// 	{ id: 16, name: 'Classnames', size: 90, fillColor: '#DCDCDC' },
	// 	{ id: 17, name: 'Serve', size: 100, fillColor: '#DCDCDC' },
	// 	{ id: 18, name: 'Snap', size: 150, fillColor: '#DCDCDC' },
	// 	{ id: 19, name: 'Helmet', size: 150, fillColor: '#DCDCDC' },
	// ]
	var d = [];
	families.forEach(f =>{
		d.push({id:uuid(),name:f,color:familyColors[f + "2"],	type: "packedbubble",data:[]})
	})



	const [data, setData] = React.useState(d)
	//const [data, setData] = React.useState([])
	const [trigger, setTrigger] = React.useState(false)

	const changeData = () => {
		setData(function(oldData, props) {
			d.forEach(r =>{ r.name !== 'hip hop' ? r.size =50:{} })
			console.log("newData",oldData);
			return d
		});
	}
	const st = () => {
		console.log("setTrigger");
		setTrigger(true)
	}


	//testing: display all available families and genres within
	//where size of genre = # of times occured, this gets slightly misleading
	//when some artists are better described than others

	//todo: relative scale needs to change depending on total # of points?
	var relativeScale = 50;

	// useEffect(() => {
	// 	var map = {}
	// 	//var data = []
	// 	if(trigger){
	// 		globalState["dacandyman01" + "_artists"].filter(i =>{return i.term === term})
	// 			.forEach(a =>{
	// 				if(a.familyAgg && a.familyAgg !== null) {
	// 					if (!map[a.familyAgg]) {
	// 						map[a.familyAgg] = {artists:[],genres:{}}
	// 					} else {
	// 						map[a.familyAgg].artists.push(a)
	// 						//for each genre in artist
	// 						a.genres.forEach(g =>{
	// 							if(map[a.familyAgg].genres[g.name]){map[a.familyAgg].genres[g.name]++}
	// 							else{map[a.familyAgg].genres[g.name] = 1 }
	// 						})
	// 					}
	// 				}})
	//
	// 		debugger;
	// 		console.log("$map",map);
	// 		var newData = JSON.parse(JSON.stringify(d))
	// 		Object.keys(map).forEach(fam =>{
	// 			var series = _.find(newData, function(o) { return o.name === fam });
	// 			series.data = []
	// 			Object.keys(map[fam].genres).forEach(g =>{
	// 				series.data.push({name:g,
	// 					value:map[fam].genres[g] * relativeScale,
	// 					color:familyColors[fam]
	// 					//color:"black"
	// 				})
	// 			})
	// 			// series.data.push({name:"1",value:x % 2 ? 1:100})
	//
	//
	// 		});
	// 		newData = newData.filter(r =>{return !(r.data.length === 0)})
	// 		//Object.keys(map).forEach(fam =>{data.push({id:uuid(),name:fam,size:map[fam] * 10,fillColor:familyColors[fam]})});
	// 		console.log("$new data",newData);
	// 		setData(newData)
	// 	}
	//
	// },[trigger,term]);

	useEffect(() => {
		var map = {}
		//var data = []
		if(trigger){
			// globalState["dacandyman01" + "_artists"].filter(i =>{return i.term === term})
			globalState["dacandyman01" + "_artists"].filter(i =>{return i.source === "saved"})
				.forEach(a =>{
					if(a.familyAgg && a.familyAgg !== null) {
						if (!map[a.familyAgg]) {
							map[a.familyAgg] = {artists:{}}
						} else {
							//map[a.familyAgg].artists.push(a)
								if(map[a.familyAgg].artists[a.name]){map[a.familyAgg].artists[a.name]++}
								else{map[a.familyAgg].artists[a.name] = 1 }
						}
					}})

			debugger;
			console.log("$map",map);
			var newData = JSON.parse(JSON.stringify(d))
			Object.keys(map).forEach(fam =>{
				var series = _.find(newData, function(o) { return o.name === fam });
				series.data = []
				Object.keys(map[fam].artists).forEach(aname =>{
					series.data.push({name:aname,
						value:map[fam].artists[aname] * relativeScale,
						color:familyColors[fam]
						//color:"black"
					})
				})
				// series.data.push({name:"1",value:x % 2 ? 1:100})


			});
			newData = newData.filter(r =>{return !(r.data.length === 0)})
			//Object.keys(map).forEach(fam =>{data.push({id:uuid(),name:fam,size:map[fam] * 10,fillColor:familyColors[fam]})});
			console.log("$new data",newData);
			setData(newData)
		}

	},[trigger,term]);



	const selectedKeyHandler = (key) => {
		// eslint-disable-next-line no-alert
		alert(key)
	}

	const handleHover = (key) => {
		console.log("handleHover",key);
		// eslint-disable-next-line no-alert
	}

	const options = {
		tooltip: {
			useHTML: true,
			pointFormat: '<b>{point.name}:</b> {point.value}'
		},
		plotOptions: {
			packedbubble: {
				minSize: "20%",
				maxSize: "100%",
				zMin: 0,
				zMax: 100,
				layoutAlgorithm: {
					gravitationalConstant: 0.05,
					splitSeries: true,
					seriesInteraction: false,
					dragBetweenSeries: true,
					parentNodeLimit: true
				},
				dataLabels: {
					enabled: true,
					format: "{point.name}",
					filter: {
						property: "y",
						operator: ">",
						value: 250
					},
					style: {
						color: "black",
						textOutline: "none",
						fontWeight: "normal"
					}
				}
			}
		},
		series:data,
		credits: {
			enabled: false
		},
		// series: [
		// 	{
		// 		type: "packedbubble",
		// 		data: [{name:"1",value:1},{name:"2",value:2}]
		// 	},
		// 	{
		// 		type: "packedbubble",
		// 		color:"blue",
		// 		data: [{name:"1",value:1,color:"lightblue"},{name:"2",value:2}]
		// 	}
		// ]
	};


	return(
		<div>
			<div>
				Common Saved Artists: (create node from here?)
				Common Saved Tracks:
				Collaborative Playlists: (# and link to table that auto-filtered)

				<button onClick={changeData}>changeData</button>
				<button onClick={st}>trigger</button>
				<div style={{display:"flex"}}>
					<div>
						<HighchartsReact highcharts={Highcharts} options={options} />
					</div>
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
			{globalState["dacandyman01" + "_artists"] && <MaterialTable
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
				data={globalState["dacandyman01" + "_artists"].filter(i =>{return i.term === term})}
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
